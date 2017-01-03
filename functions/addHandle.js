var sqlite3 = require('sqlite3');

module.exports = {
    //add handle
    run: function(handle, type, type_id) {
        var db = new sqlite3.Database('sqlite.db');
        console.log("addHandle for " + type + ": " + type_id);
        db.configure("busyTimeout", 60000);
        db.run("INSERT OR IGNORE INTO handles (handle, type, type_id) VALUES ($handle, $type, $type_id)", {
            $handle: handle,
            $type: type,
            $type_id: type_id,
        });
        db.close();
    }
};
