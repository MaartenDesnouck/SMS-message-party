var ping = require('ping');
var sendDeviceStatus = require('./sendDeviceStatus');

module.exports = {
    run: function(stopcontact, gateway, smsgateway_website, smsgateway_devices, send_offset) {
        //console.log('[updateDeviceStatuses]');
        var epoch = Math.floor((new Date).getTime() / 1000);
        var aantalDevices = smsgateway_devices.length;
        for (var j = 0; j < aantalDevices; j++) {
            smsgateway_devices[j].seconds = -1;

            var promise = gateway.getDevice(smsgateway_devices[j].id);
            (function(j) { //een closure om j mee te geven aan de promise. Anderes tegen dat de callback er is zijn we anders aan het einde van de lus en j=2
                promise.then(function(result) {
                    var offset = epoch - result.last_seen
                        //console.log(j+" : "+offset);
                    smsgateway_devices[j].seconds = offset;
                });
            })(j);
        }

        ping.sys.probe("smsgateway.me", function(isAlive) {
            if (isAlive) {
                smsgateway_website = "up";
            } else {
                smsgateway_website = "down";
            }
        });

        setTimeout(function() {
            //console.log("-sendDeviceStatus "+stopcontact);
            sendDeviceStatus.run(stopcontact, smsgateway_website, smsgateway_devices);
        }, send_offset * 1000);
    }
};
