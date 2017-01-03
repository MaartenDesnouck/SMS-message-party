var sqlite3 = require('sqlite3');
var timeStamp = require('./timeStamp');
var sendUsersChart = require('./sendUsersChart');

module.exports = {
    //De tellers van users updaten en doorsturen
    run: function(stopcontact, data_usersChart_active, data_usersChart_stopped, data_usersChart_blocked, data_usersChart_labels, interval_fillUsersChart, start_timeStamp, maxPointsUsers, send_offset) {
        //console.log('[countUsersChart]');
        var epoch = Math.floor((new Date).getTime() / 1000);
        var indexTotal = Math.floor((epoch - start_timeStamp) / interval_fillUsersChart);
        var index = indexTotal % maxPointsUsers;

        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.get("SELECT COUNT(*) as count FROM users where status='active'", function(err, row) {
            data_usersChart_active[index] = row.count;
        });
        db.get("SELECT COUNT(*) as count FROM users where status='stopped'", function(err, row) {
            data_usersChart_stopped[index] = row.count;
        });
        db.get("SELECT COUNT(*) as count FROM users where status='blocked'", function(err, row) {
            data_usersChart_blocked[index] = row.count;
        });
        db.close();
        data_usersChart_labels[index] = timeStamp.run();

        setTimeout(function() {
            sendUsersChart.run(index, stopcontact, data_usersChart_active, data_usersChart_stopped, data_usersChart_blocked, data_usersChart_labels, maxPointsUsers);
        }, send_offset * 1000);
    }
};
