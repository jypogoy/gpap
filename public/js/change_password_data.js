function checkByLastSix(password) {
    var d = $.Deferred();
    var params = {};
    params.password = password;

    $.post('../security/checkbylastsixpasswords/', params, function (hasMatch) {
        d.resolve(hasMatch);
    });

    return d.promise();
}

function checkSameDayChange() {
    var d = $.Deferred();
    
    $.post('../security/passwordchangedsameday/', function (count) {
        d.resolve(count);
    });

    return d.promise();
}

function checkPassDict(password) {
    var d = $.Deferred();
    var params = {};
    params.password = password;

    $.post('../security/passworddictionarycheck/', params, function (count) {
        d.resolve(count);
    });

    return d.promise();
}

function checkTrivial(password) {
    var d = $.Deferred();
    var params = {};
    params.password = password;

    $.post('../security/passwordtrivialcheck/', params, function (count) {
        d.resolve(count);
    });

    return d.promise();
}

function checkPersonal(password) {
    var d = $.Deferred();
    var params = {};
    params.password = password;

    $.post('../security/passwordpersonalinfocheck/', params, function (count) {
        d.resolve(count);
    });

    return d.promise();
}