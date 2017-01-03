var sqlite3 = require('sqlite3');
var fillDatabaseWithPage = require('./fillDatabaseWithPage');

module.exports = {
    //SMSgateway checken en nieuwe berichten inladen
    run: function(gateway, start_timeStamp) {
        //console.log('[fillDatabase]');
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.get("SELECT COUNT(*) as count FROM messages", function(err, row) {
            var pagina = Math.ceil((row.count + 1) / 500);
            var oude = row.count % 500;
            //console.log("Pagina:"+pagina);
            //console.log("Oude:"+oude);
            fillDatabaseWithPage.run(pagina, oude, gateway, start_timeStamp);
        });
        db.close();
    }
};
