var insertMessageIntoDatabase = require('./insertMessageIntoDatabase');

module.exports = {
    //Database met specifieke pagina updaten
    run: function(page, oude, gateway, start_timeStamp) {
        //console.log('[fillDatabaseWithPage:'+page+']');
        gateway.getMessages(page).then(function(data) {
            laatsteBerichtenPagina = data;
            //console.log("SMSEN op page "+page+":"+laatsteBerichtenPagina.length);
            for (messages = 0; messages < laatsteBerichtenPagina.length - oude; messages++) {
                var gateway_id = laatsteBerichtenPagina[messages].id;
                var bericht = laatsteBerichtenPagina[messages].message;
                var status = laatsteBerichtenPagina[messages].status;
                var phonenumber = laatsteBerichtenPagina[messages].contact.number;
                var created_at = laatsteBerichtenPagina[messages].created_at;
                var read = 'unread';
                var epoch = Math.floor((new Date).getTime() / 1000);
                if (created_at > start_timeStamp + 14400) { //in het laatste uur
                    insertMessageIntoDatabase.run(gateway_id, bericht, status, phonenumber, epoch, read);
                }
            }
        }).fail(function(message) {
            console.log('failed', message);
        });
    }
};
