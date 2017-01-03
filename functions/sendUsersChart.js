module.exports = {
    //update doorsturen naar de client
    run: function(index, socket, data_usersChart_active, data_usersChart_stopped, data_usersChart_blocked, data_usersChart_labels, maxPointsUsers) {
        if (socket != null) {
            socket.emit('UsersChart', {
                total: data_usersChart_blocked[index] + data_usersChart_active[index] + data_usersChart_stopped[index],
                active: data_usersChart_blocked[index] + data_usersChart_active[index],
                blocked: data_usersChart_blocked[index],
                label: data_usersChart_labels[index],
                maxPoints: maxPointsUsers,
            });
        }
    }
};
