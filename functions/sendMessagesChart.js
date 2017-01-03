module.exports = {
    //update doorsturen naar de client
    run: function(index, socket, data_messagesChart_sent, data_messagesChart_handeled, data_messagesChart_labels, maxPointsMessages) {
        if (socket != null) {
            socket.emit('MessagesChart', {
                total: data_messagesChart_sent[index] + data_messagesChart_handeled[index],
                sent: data_messagesChart_sent[index],
                label: data_messagesChart_labels[index],
                maxPoints: maxPointsMessages,
            });
        }
    }
};
