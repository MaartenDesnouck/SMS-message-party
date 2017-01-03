var sqlite3 = require('sqlite3');

module.exports = {
    //status van een bericht in database updaten
    run: function(gateway_id, newStatus) {
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        //console.log("MESSAGE_UPDATE:"+gateway_id);
        db.run("UPDATE messages SET status=$status WHERE gateway_id=$gateway_id", {
            $gateway_id: gateway_id,
            $status: newStatus,
        });
        db.close();
    }
};
