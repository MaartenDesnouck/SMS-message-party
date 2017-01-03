$(function () {
    var socket = io.connect();

    socket.on("phonestatus", function(data) {
        console.log(data);
        if(data.seconds<0){
            document.getElementById(data.id).innerHTML = '<span class="pull-right label bg-red"> _</span>'
        } else if(data.seconds<120){
            document.getElementById(data.id).innerHTML = '<span class="pull-right label bg-green"> '+data.seconds+' s</span>'
        } else if(data.seconds<300){
            document.getElementById(data.id).innerHTML = '<span class="pull-right label bg-orange"> '+data.seconds+' s</span>'
        } else {
            document.getElementById(data.id).innerHTML = '<span class="pull-right label bg-red"> '+data.seconds+' s</span>'
        }
    });
    socket.on("websitestatus", function(data) {
        console.log(data);
        if(data.status == "down"){
            document.getElementById("websitestatus").innerHTML = '<span class="pull-right label bg-red"> DOWN </span>'
        } else if(data.status == "up"){
            document.getElementById("websitestatus").innerHTML = '<span class="pull-right label bg-green"> UP </span>'
        } else {
            document.getElementById("websitestatus").innerHTML = '<span class="pull-right label bg-red"> _ </span>'
        }
    });
});
