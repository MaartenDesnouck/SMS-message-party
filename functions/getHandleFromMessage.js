module.exports = {
    //de handle uit de message extraheren
    run: function(message, cb) {
        //console.log("getHandleFromMessage: "+message);
        var at = message.indexOf("@");
        var spatie = message.indexOf(" ");
        if (at == 0 && spatie > 1) {
            cb(null, message.substring(at + 1, spatie));
        } else {
            cb('error', null);
        }
    }
};
