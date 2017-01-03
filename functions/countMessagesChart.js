var sqlite3 = require('sqlite3');
var timeStamp = require('./timeStamp');
var sendMessagesChart = require('./sendMessagesChart');

module.exports = {
    //De tellers van messages updaten en doorsturen
    run: function(stopcontact, data_messagesChart_handeled, data_messagesChart_sent, data_messagesChart_labels, interval_fillMessagesChart, start_timeStamp, maxPointsMessages, send_offset) {
        //console.log('[countMessagesChart]');
        var epoch = Math.floor((new Date).getTime() / 1000);
        var stamp = epoch - interval_fillMessagesChart;
        var indexTotal = Math.floor((epoch - start_timeStamp) / interval_fillMessagesChart);
        var index = (indexTotal) % maxPointsMessages;
        //console.log(indexTotal+" : "+index+" : "+stamp);

        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.get("SELECT COUNT(*) as count FROM messages where status='handled' and created_at>'" + stamp + "'", function(err, row) {
            //Dit moet met prepared statements dude.
            data_messagesChart_handeled[index] = row.count;
        });
        db.get("SELECT COUNT(*) as count FROM messages where status='sent' and created_at>'" + stamp + "'", function(err, row) {
            //Dit moet met prepared statements dude.
            data_messagesChart_sent[index] = row.count;
        });
        db.close();
        data_messagesChart_labels[index] = timeStamp.run();

        setTimeout(function() {
            sendMessagesChart.run(index, stopcontact, data_messagesChart_sent, data_messagesChart_handeled, data_messagesChart_labels, maxPointsMessages);
        }, send_offset * 1000);
    }
};
