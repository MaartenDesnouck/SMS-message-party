var sqlite3 = require('sqlite3');
var correctPhonenumber = require('./correctPhonenumber');

module.exports = {
    //nieuwe user toevoegen
    run: function(phonenumber, cb) {
        var db = new sqlite3.Database('sqlite.db');
        console.log("newUser: " + phonenumber);
        db.configure("busyTimeout", 60000);
        db.run("INSERT OR IGNORE INTO users (phonenumber, status) VALUES ($phonenumber, $status)", {
            $phonenumber: correctPhonenumber.run(phonenumber),
            $status: 'active',
        }, function(status, userId) {
            //console.log(this);
            cb("success", this.lastID);
        });
        db.close();
    }
};
