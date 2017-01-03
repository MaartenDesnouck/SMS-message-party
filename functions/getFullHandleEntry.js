var sqlite3 = require('sqlite3');

module.exports = {
    //bestaat entry met deze handle?
    run: function(handle, cb) {
        //console.log("getFullHandleEntry:"+handle+":");
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.get("SELECT handle, type, type_id FROM handles WHERE handle='" + handle + "'", function(err, row) {
            //Dit moet met prepared statements dude.
            cb(null, row);
        });
        db.close();
    }
};
