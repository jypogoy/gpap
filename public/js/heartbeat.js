var total_spent_time = 0;
var timer = setInterval(function () {
    $.post("/gpap/session/keepalive", null, function (response) {      
        console.log(response.indexOf('Unauthorized') != -1 ? 'Session Expired! :(' : 'Session Active :)')  
        if (response.length == 0) {
            var minutes = Math.floor(total_spent_time / 60);
            var seconds = total_spent_time - minutes * 60;
            toastr.error('Your session has expired!');
            console.error('WARNING! No active session detected: ' + response);
            clearInterval(timer);
        }
        total_spent_time = total_spent_time + 10000;
    });
}, 5000);