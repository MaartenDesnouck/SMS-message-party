var sqlite3 = require('sqlite3');

module.exports = {
    //change user status
    run: function(phonenumber, newStatus) {
        //console.log("changeUserStatus: "+newStatus);
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.run("UPDATE users SET status=$newStatus WHERE phonenumber=$phonenumber", {
            $phonenumber: phonenumber,
            $newStatus: newStatus,
        });
        db.close();
    }
};
