var socket = io();

function sendSMS() {
    console.log('sendSMS');
    socket.emit('sendSMS', {
        bericht: document.getElementById("SendSMS_bericht").value,
        telefoonnr: document.getElementById("SendSMS_nr").value
    });
}

function sendBroadcast() {
    console.log('sendBroadcast');
    socket.emit('sendBroadcast', {
        bericht: document.getElementById("sendBroadcast_bericht").value,
    });
}

function blockUser() {
    console.log('blockUser');
    socket.emit('blockUser', {
        telefoonnr: document.getElementById("blockUser_nr").value,
    });
}

function unblockUser() {
    console.log('unblockUser');
    socket.emit('unblockUser', {
        telefoonnr: document.getElementById("unblockUser_nr").value,
    });
}

function addAlias() {
    console.log('addAlias');
    socket.emit('addAlias', {
        alias: document.getElementById("addAlias_alias").value,
        id: document.getElementById("addAlias_id").value
    });
}

function removeAlias() {
    console.log('removeAlias');
    socket.emit('removeAlias', {
        alias: document.getElementById("removeAlias_alias").value,
        id: document.getElementById("removeAlias_id").value
    });
}

function addBlocklist() {
    console.log('addBlocklist');
    socket.emit('addBlocklist', {
        from: document.getElementById("addBlocklist_from").value,
        to: document.getElementById("addBlocklist_to").value
    });
}

function removeBlocklist() {
    console.log('removeBlocklist');
    socket.emit('removeBlocklist', {
        from: document.getElementById("removeBlocklist_from").value,
        to: document.getElementById("removeBlocklist_to").value
    });
}
