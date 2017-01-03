var sqlite3 = require('sqlite3');

module.exports = {
    //zoek user bij handle
    run: function(handle, cb) {
        //console.log("getUserFromHandle:"+handle+":");
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.get("SELECT handle, type_id, phonenumber, status FROM handles JOIN users ON users.id = handles.type_id WHERE handles.handle='" + handle + "'", function(err, row) {
            //Dit moet met prepared statements dude.
            cb(null, row);
        });
        db.close();
    }
};
