var sqlite3 = require('sqlite3');
var handleRecievedMessage = require('./handleReceivedMessage');

module.exports = {
    //De database checken op received berichten die nog niet handled zijn
    run: function(my_phonenumber, gateway, smsgateway_devices, live) {
        //console.log('[processDatabase]');
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.each("SELECT gateway_id, message, phonenumber FROM messages where status='received'", function(err, row) {
            handleRecievedMessage.run(gateway, row.gateway_id, smsgateway_devices, row.message, row.phonenumber, my_phonenumber, live);
        });
        db.close();
    }
};
