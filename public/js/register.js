var SignUp = {
    validate: function () {        
        var valid = true;
        $('#registerForm *').filter(':input').each(function () {
            var el = this;
            if ($("#" + el.id + "_div").hasClass('required')) {
                if ($.trim(el.value) == '') {
                    $("#" + el.id + "_div").addClass('error');
                    $("#" + el.id + "_alert").removeClass('hidden');
                    $("#" + el.id + "_alert").addClass('visible');
                    valid = false;
                } else {    
                    $("#" + el.id + "_div").removeClass('error');
                    $("#" + el.id + "_alert").addClass('hidden');
                    $("#" + el.id + "_alert").removeClass('visible');
                }
            }    
        });        

        if ($("#repeatPassword")[0].value != '') {
            if ($("#password")[0].value != $("#repeatPassword")[0].value) {
                $("#repeatPassword_alert").show();
                $("#repeatPassword_div").addClass('error');
                $("#repeatPassword_alert").removeClass('hidden');
                $("#repeatPassword_alert").addClass('visible');
                valid = false;
            } else {
                $("#repeatPassword_div").removeClass('error');
                $("#repeatPassword_alert").addClass('hidden');
                $("#repeatPassword_alert").removeClass('visible');
            }
        }    

        $('.error').find('input:text, input:password, textarea').first().focus();
        if (!valid) return false;

        $("#registerForm")[0].submit();
    }
}

$(document).ready(function () {
    $("#registerForm input:text, input:password, #registerForm textarea").first().focus();
    $("#registerForm .alert").hide();
    $("div.profile .alert").hide();
});
