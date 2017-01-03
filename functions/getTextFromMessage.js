module.exports = {
    //de ruwe tekst uit de message extraheren
    run: function(message, cb) {
        //console.log("getTextFromMessage: "+message);
        var at = message.indexOf("@");
        var spatie = message.indexOf(" ");
        if (at == 0 && spatie > 1) {
            cb(null, message.substring(spatie, message.length));
        } else {
            cb('error', null);
        }
    }
};
