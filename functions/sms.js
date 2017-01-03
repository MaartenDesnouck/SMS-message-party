var colors = require('colors');
var correctPhonenumber = require('./correctPhonenumber');
var timeStamp = require('./timeStamp');

module.exports = {
    //send SMS or log on console
    run: function(gateway, phonenumber, text, deviceid, live, options) {
        if (live) {
            if (options && options == "many") {
                gateway.send(phonenumber, text, deviceid);
                logmessage = timeStamp.run() + " SEND TO MANY: " + text;
                console.log(logmessage.cyan);
            } else {
                gateway.send(correctPhonenumber.run(phonenumber), text, deviceid);
                logmessage = timeStamp.run() + " SEND: " + phonenumber + " : " + text;
                console.log(logmessage.cyan);
            }
        } else {
            if (options && options == "many") {
                logmessage = timeStamp.run() + " SEND TO MANY: " + text;
                console.log(logmessage.cyan);
            } else {
                logmessage = timeStamp.run() + " SEND: " + phonenumber + " : " + text;
                console.log(logmessage.cyan);
            }
        }
    }
};
