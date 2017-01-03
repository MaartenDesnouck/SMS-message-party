var sqlite3 = require('sqlite3');

module.exports = {
    //nieuwe conversation toevoegen
    run: function(starter_user_id, receiver_user_id, cb) {
        var db = new sqlite3.Database('sqlite.db');
        console.log("newConversation: " + starter_user_id + " to " + receiver_user_id);
        db.configure("busyTimeout", 60000);
        db.run("INSERT OR IGNORE INTO conversations (starter_user_id, receiver_user_id) VALUES ($starter_user_id, $receiver_user_id)", {
            $starter_user_id: starter_user_id,
            $receiver_user_id: receiver_user_id,
        }, function(status, conversationId) {
            //console.log(this);
            cb("success", this.lastID);
        });
        db.close();
    }
};
