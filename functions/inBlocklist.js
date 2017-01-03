var sqlite3 = require('sqlite3');

module.exports = {
    //blocklist checken
    run: function(id_from, id_to, cb) {
        //console.log("inBlocklist?");
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.get("SELECT COUNT(*) as count FROM blocklist WHERE id_from='" + id_from + "' AND id_to='" + id_to + "'", function(err, row) {
            //Dit moet met prepared statements dude.
            cb(null, row.count);
        });
        db.close();
    }
};
