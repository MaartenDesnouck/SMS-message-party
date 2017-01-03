$(function () {
    var socket = io.connect();
    //console.log(socket);
    var usersChartPoints = 0;
    var messagesChartPoints = 0;

    //-------------
    //- PIE CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#pieChart").get(0).getContext("2d");
    var data = [
      {
        value: 0,
        color: "#238523",
        highlight: "#238523",
        label: "Active"
      },
      {
        value: 0,
        color: "#8f8f8f",
        highlight: "#8f8f8f",
        label: "Stopped"
      },
      {
        value: 0,
        color: "#b01919",
        highlight: "#b01919",
        label: "Blocked"
      }
    ];
    var options = {
      //Boolean - Whether we should show a stroke on each segment
      segmentShowStroke: true,
      //String - The colour of each segment stroke
      segmentStrokeColor: "#fff",
      //Number - The width of each segment stroke
      segmentStrokeWidth: 1,
      //Number - The percentage of the chart that we cut out of the middle
      percentageInnerCutout: 60, // This is 0 for Pie charts
      //Number - Amount of animation steps
      animationSteps: 100,
      //String - Animation easing effect
      animationEasing: "easeOutCirc",
      //Boolean - Whether we animate the rotation of the Doughnut
      animateRotate: true,
      //Boolean - Whether we animate scaling the Doughnut from the centre
      animateScale: false,
      //Boolean - whether to make the chart responsive to window resizing
      responsive: true,
      //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
      maintainAspectRatio: true,
     };
    //Create pie or douhnut chart
    // You can switch between pie and douhnut using the method below.
    window.myPieChart = new Chart(ctx).Pie(data,options);

    //-------------
    //- MESSAGES CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    var ctx2 = $("#messagesChart").get(0).getContext("2d");
    var data2 = {
        labels: [],
        datasets: [
            {
                label: "Total",
                fillColor: "rgba(35,133,35,0.2)",
                strokeColor: "rgba(35,133,35,1)",
                pointColor: "rgba(35,133,35,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(35,133,35,1)",
                data: []
            },
            {
                label: "Sent",
                fillColor: "rgba(227,171,0,0.2)",
                strokeColor: "rgba(227,171,0,1)",
                pointColor: "rgba(227,171,0,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(227,171,0,1)",
                data: []
            },
            {
                label: "",
                fillColor: "rgba(0,0,0,0)",
                strokeColor: "rgba(0,0,0,0)",
                pointColor: "rgba(0,0,0,0)",
                pointStrokeColor: "rgba(0,0,0,0)",
                pointHighlightFill: "rgba(0,0,0,0)",
                pointHighlightStroke: "rgba(0,0,0,0)",
                data: []
            }
        ]
    };
    var options2 = {
        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,
        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth : 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - Whether the line is curved between points
        bezierCurve : true,
        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,
        //Boolean - Whether to show a dot for each point
        pointDot : true,
        //Number - Radius of each point dot in pixels
        pointDotRadius : 2,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 1,
        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,
    };
    window.myMessagesChart = new Chart(ctx2).Line(data2, options2);

    //-------------
    //- USERS CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    var ctx3 = $("#usersChart").get(0).getContext("2d");
    var data3 = {
        labels: [],
        datasets: [
            {
                label: "Total",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
            {
                label: "Active",
                fillColor: "rgba(35,133,35,0.2)",
                strokeColor: "rgba(35,133,35,1)",
                pointColor: "rgba(35,133,35,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(35,133,35,1)",
                data: []
            },
            {
                label: "Blocked",
                fillColor: "rgba(181,0,0,0.2)",
                strokeColor: "rgba(181,0,0,1)",
                pointColor: "rgba(181,0,0,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(181,0,0,1)",
                data: []
            },
            {
                label: "",
                fillColor: "rgba(0,0,0,0)",
                strokeColor: "rgba(0,0,0,0)",
                pointColor: "rgba(0,0,0,0)",
                pointStrokeColor: "rgba(0,0,0,0)",
                pointHighlightFill: "rgba(0,0,0,0)",
                pointHighlightStroke: "rgba(0,0,0,0)",
                data: []
            }
        ]
    };
    var options3 = {
        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,
        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth : 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - Whether the line is curved between points
        bezierCurve : true,
        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,
        //Boolean - Whether to show a dot for each point
        pointDot : true,
        //Number - Radius of each point dot in pixels
        pointDotRadius : 2,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 1,
        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true
    };
    window.myUsersChart = new Chart(ctx3).Line(data3, options3);

    socket.on('SMScounter', function(data) {
        console.log(data);
        if(data.received!=undefined){
            document.getElementById("sms_received").innerHTML = data.received;
        }
        if(data.handled!=undefined){
            document.getElementById("sms_handled").innerHTML = data.handled;
        }
        if(data.pending!=undefined){
            document.getElementById("sms_pending").innerHTML = data.pending;
        }
        if(data.queued!=undefined){
            document.getElementById("sms_queued").innerHTML = data.queued;
        }
        if(data.failed!=undefined){
            document.getElementById("sms_failed").innerHTML = data.failed;
        }
        if(data.sent!=undefined){
            document.getElementById("sms_sent").innerHTML = data.sent;
        }
    });

    socket.on('Usercounter', function(data) {
        //console.log(data);
        if(data.active!=undefined){
            window.myPieChart.segments[0].value = data.active;
            window.myPieChart.update();
            document.getElementById("user_active").innerHTML = data.active;
        }
        if(data.stopped!=undefined){
            window.myPieChart.segments[1].value = data.stopped;
            window.myPieChart.update();
            document.getElementById("user_stopped").innerHTML = data.stopped;
        }
        if(data.blocked!=undefined){
            window.myPieChart.segments[2].value = data.blocked;
            window.myPieChart.update();
            document.getElementById("user_blocked").innerHTML = data.blocked;
        }
    });

    socket.on('MessagesChart', function(data) {
        console.log(data);
        window.myMessagesChart.addData([data.total, data.sent, 0], data.label);
        messagesChartPoints++;
        if(messagesChartPoints>data.maxPoints){
            window.myMessagesChart.removeData();
            messagesChartPoints--;
        }
    });

    socket.on('UsersChart', function(data) {
        //console.log(data);
        window.myUsersChart.addData([data.total, data.active, data.blocked, 0], data.label);
        usersChartPoints++;
        if(usersChartPoints>data.maxPoints){
            window.myUsersChart.removeData();
            usersChartPoints--;
        }
    });
});
