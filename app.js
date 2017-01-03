var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require('socket.io');
var sqlite3 = require('sqlite3') //add .verbose() for long stack traces
var SmsGateway = require('./public/js/smsgateway');

var dashboard = require('./routes/dashboard');
var messages = require('./routes/messages');
var actions = require('./routes/actions');
var include = require('./routes/include');

var updateDatabase = require('./functions/updateDatabase');
var fillDatabase = require('./functions/fillDatabase');
var processDatabase = require('./functions/processDatabase');
var countDatabase = require('./functions/countDatabase');
var timeStamp = require('./functions/timeStamp');
var sendDeviceStatus = require('./functions/sendDeviceStatus');
var getActiveUsers = require('./functions/getActiveUsers');
var changeUserStatus = require('./functions/changeUserStatus');
var countMessagesChart = require('./functions/countMessagesChart');
var countUsersChart = require('./functions/countUsersChart');
var updateDeviceStatuses = require('./functions/updateDeviceStatuses');
var SMS = require('./functions/SMS');

// Express
var app = express();

// Socket.io
var io = socket_io();
app.io = io;

// Config inladen
var config = require('config');
var smsgateway_username = config.get('smsgateway.username');
var smsgateway_password = config.get('smsgateway.password');
GLOBAL.smsgateway_devices = config.get('smsgateway.devices');
var smsgateway_website = -1;
var my_phonenumber = config.get('phonenumber');
var live = config.get('live');

//printen of het live is of niet
if (live) {
    console.log("########### LIVE ###########".red);
} else {
    console.log("########### NOT LIVE ###########".red);
}

//smsgateway inloggen
var gateway = new SmsGateway(smsgateway_username, smsgateway_password);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
//app.use(logger('dev')); // Om GET e.d. te loggen
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// matcht in deze volgorde dus als er bv /messages in dashboard gedefinieerd staat zal die matchen!
app.use('/', dashboard);
app.use('/messages', messages);
app.use('/actions', actions);
app.use('/include', include);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//Intervallen van getimede functies definieren (in seconden)
var interval_updateDatabase = 5;
var interval_fillDatabase = 5;
var interval_processDatabase = 5;
var interval_countDatabase = 5;
var interval_fillMessagesChart = 5 * 60;
var interval_fillUsersChart = 5 * 60;
var interval_updateDeviceStatuses = 5;

//constanten voor de charts
var maxPointsMessages = 50;
var maxPointsUsers = 50;
var send_offset = 5;

//constanten
var start_timeStamp = Math.floor((new Date).getTime() / 1000);

//moving chart windows
var data_usersChart_active = [];
var data_usersChart_stopped = [];
var data_usersChart_blocked = [];
var data_usersChart_labels = [];
var epoch = Math.floor((new Date).getTime() / 1000);
var indexTotal = Math.floor((epoch - start_timeStamp) / interval_fillUsersChart);

for (var i = 1; i < maxPointsUsers + 1; i++) {
    data_usersChart_active.push(0);
    data_usersChart_stopped.push(0);
    data_usersChart_blocked.push(0);
    var index = (indexTotal + i) % maxPointsUsers;
    data_usersChart_labels[index] = "";
}

var data_messagesChart_handeled = [];
var data_messagesChart_sent = [];
var data_messagesChart_labels = [];
var indexTotal2 = Math.floor((epoch - start_timeStamp) / interval_fillMessagesChart);

for (var i = 1; i < maxPointsMessages + 1; i++) {
    data_messagesChart_handeled.push(0);
    data_messagesChart_sent.push(0);
    var index = (indexTotal2 + i) % maxPointsMessages;
    data_messagesChart_labels[index] = "";
}

//Socket IO functions
var stopcontact = null; //om te kunnen emitten van de ander functies
io.sockets.on('connection', function(socket) {
    stopcontact = socket;

    //charts doorsturen die we al hebben
    sendDeviceStatus.run(stopcontact, smsgateway_website, smsgateway_devices);

    var epoch = Math.floor((new Date).getTime() / 1000) - send_offset;
    var indexTotal = Math.floor((epoch - start_timeStamp) / interval_fillUsersChart);

    for (var i = 2; i < maxPointsUsers + 1; i++) {
        var index = (indexTotal + i) % maxPointsUsers;
        socket.emit('UsersChart', {
            total: data_usersChart_blocked[index] + data_usersChart_active[index] + data_usersChart_stopped[index],
            active: data_usersChart_blocked[index] + data_usersChart_active[index],
            blocked: data_usersChart_blocked[index],
            label: data_usersChart_labels[index],
            maxPoints: maxPointsUsers,
        });
    }
    for (var i = 2; i < maxPointsMessages + 1; i++) {
        var index = (indexTotal + i) % maxPointsMessages;
        socket.emit('MessagesChart', {
            total: data_messagesChart_sent[index] + data_messagesChart_handeled[index],
            sent: data_messagesChart_sent[index],
            label: data_messagesChart_labels[index],
            maxPoints: maxPointsMessages,
        });
    }

    //De tellers van alles in de database updaten en doorsturen
    setInterval(function() {
        //console.log("Running countDatabase");
        countDatabase.run(socket);
    }, interval_countDatabase * 1000);

    //Opzoeken hoeveel berichten er in de laatste periode ontvangen/gestuurd zijn en doorsturen
    setInterval(function() {
        //console.log("Running countMessagesChart");
        countMessagesChart.run(socket, data_messagesChart_handeled, data_messagesChart_sent, data_messagesChart_labels, interval_fillMessagesChart, start_timeStamp, maxPointsMessages, send_offset);
    }, interval_fillMessagesChart * 1000);

    //Tellen hoveel users actief/stopped en blocked zijn en doorsturen
    setInterval(function() {
        //console.log("Running countUsersChart");
        countUsersChart.run(socket, data_usersChart_active, data_usersChart_stopped, data_usersChart_blocked, data_usersChart_labels, interval_fillUsersChart, start_timeStamp, maxPointsUsers, send_offset);
    }, interval_fillUsersChart * 1000);

    //
    /*setInterval(function() {
        //console.log("updateDeviceStatuses "+socket);
        updateDeviceStatuses.run(socket, gateway, smsgateway_website, smsgateway_devices, send_offset);
    }, interval_updateDeviceStatuses * 1000);*/

    socket.on('sendSMS', function(data) {
        //console.log("SOCKET IO SMS:"+data.telefoonnr+" : "+data.bericht);
        SMS.run(gateway, data.telefoonnr, data.bericht, smsgateway_devices[0].id, live);
    });
    socket.on('sendBroadcast', function(data) {
        logmessage = timeStamp.run() + " BROADCAST:" + data.bericht;
        console.log(logmessage.green);
        getActiveUsers.run(function(err, activeUsers) {
            //console.log(activeUsers);
            var activeNumbers = [];
            for (var i = 0; i < activeUsers.length; i++) {
                activeNumbers[i] = activeUsers[i].phonenumber;
            }
            SMS.run(gateway, activeNumbers, data.bericht, smsgateway_devices[0].id, live, 'many');
        });
    });
    socket.on('blockUser', function(data) {
        console.log(timeStamp.run() + " BLOCK USER:" + data.telefoonnr);
        changeUserStatus.run(data.telefoonnr, 'blocked');
    });
    socket.on('unblockUser', function(data) {
        console.log(timeStamp.run() + " UNBLOCK USER:" + data.telefoonnr);
        changeUserStatus.run(data.telefoonnr, 'active');
    });
    socket.on('addAlias', function(data) {
        console.log(timeStamp.run() + " ADD ALIAS:" + data.alias + " : " + data.id);
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.run("INSERT OR IGNORE INTO handles (handle , user_id) VALUES ($handle, $user_id)", {
            $handle: data.alias,
            $user_id: data.id
        });
        db.close();
    });
    socket.on('removeAlias', function(data) {
        console.log(timeStamp.run() + " REMOVE ALIAS:" + data.alias + " : " + data.id);
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.run("DELETE FROM handles where handle=$handle and user_id=$user_id", {
            $handle: data.alias,
            $user_id: data.id
        });
        db.close();
    });
    socket.on('addBlocklist', function(data) {
        console.log(timeStamp.run() + " ADD BLOCKLIST:" + data.from + " : " + data.to);
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.run("INSERT OR IGNORE INTO blocklist (id_from , id_to) VALUES ($id_from, $id_to)", {
            $id_from: data.from,
            $id_to: data.to
        });
        db.close();
    });
    socket.on('removeBlocklist', function(data) {
        console.log(timeStamp.run() + " REMOVE BLOCKLIST:" + data.from + " : " + data.to);
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.run("DELETE FROM blocklist where id_from=$id_from and id_to=$id_to", {
            $id_from: data.from,
            $id_to: data.to
        });
        db.close();
    });

}); //einde van io.on(connection)

//On disconnect of socket
io.sockets.on('disconnect', function() {
    stopcontact = null;
});

//Locale database checken en up to date houden met die van SMSgateway.me
setInterval(function() {
    //console.log("Running updateDatabase");
    updateDatabase.run(gateway);
}, interval_updateDatabase * 1000);

//SMSgateway blijven checken en nieuwe berichten inladen
setInterval(function() {
    //console.log("Running fillDatabase");
    fillDatabase.run(gateway, start_timeStamp);
}, interval_fillDatabase * 1000);

//De database checken op received berichten die nog niet handled zijn
setInterval(function() {
    //console.log("Running processDatabase");
    processDatabase.run(my_phonenumber, gateway, smsgateway_devices, live);
}, interval_processDatabase * 1000);

module.exports = app;
