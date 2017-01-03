var sqlite3 = require('sqlite3');

module.exports = {
    //de conversation met een zekere id ophalen
    run: function(id, cb) {
        //console.log("getUserFromHandle:"+handle+":");
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.get("SELECT starter_user_id, receiver_user_id FROM conversations WHERE id='" + id + "'", function(err, row) {
            //Dit moet met prepared statements dude.
            cb(null, row);
        });
        db.close();
    }
};
