var sqlite3 = require('sqlite3');

module.exports = {
    //get active users
    run: function(cb) {
        var db = new sqlite3.Database('sqlite.db');
        //console.log("getActiveUsers");
        db.configure("busyTimeout", 60000);
        db.all("SELECT phonenumber FROM users WHERE status='active'", function(err, result) {
            cb(null, result);
        });
        db.close();
    }
};
