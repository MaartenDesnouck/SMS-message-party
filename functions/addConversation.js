var sqlite3 = require('sqlite3');

module.exports = {
    //add conversation
    run: function(name, count, starter_user_id, receiver_user_id) {
        var db = new sqlite3.Database('sqlite.db');
        console.log("addConversation for: " + type_id);
        db.configure("busyTimeout", 60000);
        db.run("INSERT OR IGNORE INTO conversations (name, count, starter_user_id, receiver_user_id) VALUES ($name, $count, $starter_user_id, $receiver_user_id)", {
            $name: name,
            $count: count,
            $starter_user_id: starter_user_id,
            $receiver_user_id: receiver_user_id,
        });
        db.close();
    }
};
