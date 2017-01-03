module.exports = {
    //update doorsturen naar de client
    run: function(stopcontact, smsgateway_website, smsgateway_devices) {
        //console.log("sendDeviceStatus "+stopcontact);
        if (stopcontact != null) {
            for (var i = 0; i < smsgateway_devices.length; i++) {
                stopcontact.emit('phonestatus', {
                    id: smsgateway_devices[i].id,
                    seconds: smsgateway_devices[i].seconds
                });
            }
            stopcontact.emit('websitestatus', {
                status: smsgateway_website
            });
        }
    }
};
