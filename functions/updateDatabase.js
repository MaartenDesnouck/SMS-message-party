var sqlite3 = require('sqlite3');
var updateStatus = require('./updateStatus');

module.exports = {
    //Locale database checken en up to date houden
    run: function(gateway) {
        //console.log('[updateDatabase]');
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.each("SELECT gateway_id, status FROM messages where status='pending' OR status='queued'", function(err, row) {
            updateStatus.run(gateway, row.gateway_id, row.status);
        });
        db.close();
    }
};
