var sqlite3 = require('sqlite3');

var counter_SMS_received = 0;
var counter_SMS_sent = 0;
var counter_SMS_handled = 0;
var counter_SMS_failed = 0;
var counter_SMS_queued = 0;
var counter_SMS_pending = 0;
var counter_user_active = 0;
var counter_user_stopped = 0;
var counter_user_blocked = 0;

module.exports = {
    //De tellers van vanalles updaten en doorsturen
    run: function(stopcontact) {
        //console.log('[countDatabase]');
        var db = new sqlite3.Database('sqlite.db');
        db.configure("busyTimeout", 60000);
        db.get("SELECT COUNT(*) as count FROM messages where status='received'", function(err, row) {
            counter_SMS_received = row.count;
        });
        db.get("SELECT COUNT(*) as count FROM messages where status='sent'", function(err, row) {
            counter_SMS_sent = row.count;
        });
        db.get("SELECT COUNT(*) as count FROM messages where status='handled'", function(err, row) {
            counter_SMS_handled = row.count;
        });
        db.get("SELECT COUNT(*) as count FROM messages where status='failed'", function(err, row) {
            counter_SMS_failed = row.count;
        });
        db.get("SELECT COUNT(*) as count FROM messages where status='queued'", function(err, row) {
            counter_SMS_queued = row.count;
        });
        db.get("SELECT COUNT(*) as count FROM messages where status='pending'", function(err, row) {
            counter_SMS_pending = row.count;
        });
        db.get("SELECT COUNT(*) as count FROM users where status='active'", function(err, row) {
            counter_user_active = row.count;
        });
        db.get("SELECT COUNT(*) as count FROM users where status='stopped'", function(err, row) {
            counter_user_stopped = row.count;
        });
        db.get("SELECT COUNT(*) as count FROM users where status='blocked'", function(err, row) {
            counter_user_blocked = row.count;
        });
        db.close();

        if (stopcontact != null) {
            stopcontact.emit('SMScounter', {
                received: counter_SMS_received,
                handled: counter_SMS_handled,
                pending: counter_SMS_pending,
                queued: counter_SMS_queued,
                failed: counter_SMS_failed,
                sent: counter_SMS_sent
            });
            stopcontact.emit('Usercounter', {
                active: counter_user_active,
                stopped: counter_user_stopped,
                blocked: counter_user_blocked,
            });
        }
    }
};
