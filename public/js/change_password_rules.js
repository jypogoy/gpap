$(function() {

    $.fn.form.settings.rules.byLastSix = function(value) {
        $.when(checkByLastSix(value)).done(function(hasMatch) {
            return hasMatch ? false : true;
        });
    };

    $.fn.form.settings.rules.withinDayChange = function(value) {
        $.when(checkSameDayChange(value)).done(function(count) {
            return count > 0 ? true : false; // 0 is valid; greater than 0 is invalid
        });
    };

    $.fn.form.settings.rules.onDict = function(value) {
        $.when(checkPassDict(value)).done(function(count) {
            return count > 0 ? true : false; // 0 is valid; greater than 0 is invalid
        });
    };

    $.fn.form.settings.rules.trivial = function(value) {
        $.when(checkTrivial(value)).done(function(count) {
            return count > 0 ? true : false; // 0 is valid; greater than 0 is invalid
        });
    };

    $.fn.form.settings.rules.personal = function(value) {
        $.when(checkTrivial(value)).done(function(count) {
            return count > 0 ? true : false; // 0 is valid; greater than 0 is invalid
        });
    };

});