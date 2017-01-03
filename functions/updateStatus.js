var updateMessageStatusInDatabase = require('./updateMessageStatusInDatabase');

module.exports = {
    //get status of a message
    run: function(gateway, gateway_id, oldStatus) {
        //console.log('[getStatus]: '+gateway_id);
        gateway.getMessage(gateway_id).then(function(data) {
            //console.log("STATUS:"+data.status);
            var newStatus = data.status;
            if (oldStatus != newStatus) {
                updateMessageStatusInDatabase.run(gateway_id, newStatus);
            }
        }).fail(function(message) {
            console.log('failed', message);
        });
    }
};
