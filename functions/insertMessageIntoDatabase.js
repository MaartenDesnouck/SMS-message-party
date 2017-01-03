var sqlite3 = require('sqlite3');
var decodeHtmlEntities = require('./decodeHtmlEntities');
var correctPhonenumber = require('./correctPhonenumber');

module.exports = {
    //een bericht in de database steken of updaten
    run: function(gateway_id, bericht, status, phonenumber, created_at, read) {
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        //console.log("MESSAGE_NEW:"+gateway_id+":"+bericht);
        db.run("INSERT OR IGNORE INTO messages (gateway_id , message, status, phonenumber, created_at, read) VALUES ($gateway_id, $message, $status, $phonenumber, $created_at, $read)", {
            $gateway_id: gateway_id,
            $message: decodeHtmlEntities.run(bericht),
            $status: status,
            $phonenumber: correctPhonenumber.run(phonenumber),
            $created_at: created_at,
            $read: read
        });
        db.close();
    }
};
