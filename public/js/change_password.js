$(function() {

    function checkMatch(value) {
        var deferred = $.Deferred();

        $.post('../session/nondict/', { 'keyword': value }, function (hasMatch) {
            deferred.resolve(hasMatch);
        });

        return deferred.promise();
    }

    $.fn.form.settings.rules.nonDict = function(value) {
        var isDict = true;
        // $.ajax({
        //     async : false,
        //     url: '../session/nondict/',
        //     type : "POST",
        //     async: false,
        //     data : {
        //         keyword : value
        //     },
        //     success: function(data) {
        //         if (data == "0") {
        //             isDict = true;
        //         } else {
        //             isDict = false;
        //         }
        //     }
        // });
        
        $.when(checkMatch(value)).done(function(data) {
            console.log(data)
            if (data) isDict = true;
        });
        console.log(isDict)
        return isDict;

        
    };

    $('.ui.form')
    .form({
        fields: {
            current_password: {
                identifier: 'current_password',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Current password is required'
                    },
                    {
                        type   : 'minLength[10]',
                        prompt : 'Current password must be at least {ruleValue} characters'
                    },
                    {
                        type   : 'regExp',
                        value  : '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$',
                        prompt : 'Current password should be alphanumeric and contains at least 1 upper case letter and a special character'
                    },
                    {
                        type   : 'nonDict',
                        prompt : 'Current password should not contain common dictionary words.'
                    }
                ]
            },
            new_password: {
                identifier: 'new_password',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'New password is required'
                    },
                    {
                        type   : 'minLength[10]',
                        prompt : 'New password must be at least {ruleValue} characters'
                    },
                    {
                        type   : 'regExp',
                        value  : '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$',
                        prompt : 'New password should be alphanumeric and contains at least 1 upper case letter and a special character'
                    }
                ]
            },
            confirm_password: {
                identifier: 'confirm_password',
                rules: [
                    {
                        type   : 'match[new_password]',
                        prompt : 'Your specified new passwords mismatched'
                    }
                ]
            }
        }
    });

    // $('.submit.button').click(function() {
    //     if ($('.ui.form').form('is valid')) {
    //         $.post('../session/topassworddict/' + $('#new_password').val(), function (hasMatch) {
    //             if (hasMatch) {
                    
    //             }
    //         });  
    //     }
    // });    

});