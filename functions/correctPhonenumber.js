module.exports = {
    //phonenumberconversie: 00 -> +
    run: function(phonenumber) {
        //console.log("correctPhonenumber: "+phonenumber);
        if (phonenumber.length > 1 && phonenumber.substring(0, 2) == "00") {
            return '+' + phonenumber.substring(2, phonenumber.length - 1);
        } else {
            return phonenumber;
        }
    }
};
