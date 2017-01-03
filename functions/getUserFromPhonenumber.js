var sqlite3 = require('sqlite3');
var correctPhonenumber = require('./correctPhonenumber');

module.exports = {
    //getUser from phonenumber
    run: function(phonenumber, cb) {
        //console.log("getUserFromPhonenumber: "+phonenumber);
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.get("SELECT id, status, phonenumber FROM users WHERE phonenumber='" + correctPhonenumber.run(phonenumber) + "' ORDER BY id ASC LIMIT 1", function(err, row) {
            //Dit moet met prepared statements dude.
            cb(null, row);
        });
        db.close();
    }
};
