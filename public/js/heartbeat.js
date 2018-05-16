setInterval(function () {
    $.get("/gpap/session/keepalive", null, function () {});
}, 10000);