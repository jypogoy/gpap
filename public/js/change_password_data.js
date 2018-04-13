function checkByLastSix(password) {
    var d = $.Deferred();

    $.post('../security/checkbylastsixpasswords/' + password, function (hasMatch) {
        d.resolve(hasMatch);
    });

    return d.promise();
}

function checkSameDayChange(password) {
    var d = $.Deferred();

    $.post('../security/passwordchangedsameday/' + password, function (count) {
        d.resolve(count);
    });

    return d.promise();
}

function checkPassDict(password) {
    var d = $.Deferred();

    $.post('../security/passworddictionarycheck/' + password, function (count) {
        d.resolve(count);
    });

    return d.promise();
}

function checkTrivial(password) {
    var d = $.Deferred();

    $.post('../security/passwordtrivialcheck/' + password, function (count) {
        d.resolve(count);
    });

    return d.promise();
}

function checkPersonal(password) {
    var d = $.Deferred();

    $.post('../security/passwordpersonalinfocheck/' + password, function (count) {
        d.resolve(count);
    });

    return d.promise();
}