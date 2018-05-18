var total_spent_time = 0;
setInterval(function () {
    $.post("/gpap/session/keepalive", null, function (response) {        
        if (response.length == 0) {
            var minutes = Math.floor(total_spent_time / 60);
            var seconds = total_spent_time - minutes * 60;
            toastr.error('Your session has expired! <\br>Time spent is ' + minutes + ' minutes and ' + seconds + ' seconds.');
        }
        total_spent_time = total_spent_time + 10000;
    });
}, 10000);