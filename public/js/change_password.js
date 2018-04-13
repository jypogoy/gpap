$(function() {
    
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
                        type   : 'byLastSix',
                        prompt : 'Current password is already used.'
                    },
                    {
                        type   : 'withinDayChange',
                        prompt : 'Cannot change password anymore.'
                    },
                    {
                        type   : 'onDict',
                        prompt : 'Current password should not contain common dictionary words.'
                    },
                    {
                        type   : 'trivial',
                        prompt : 'Current password should not contain trivial words.'
                    },
                    {
                        type   : 'personal',
                        prompt : 'Current password should not contain personal information. i.e. usernames, names.'
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
                    },
                    {
                        type   : 'byLastSix',
                        prompt : 'New password is already used.'
                    },
                    {
                        type   : 'onDict',
                        prompt : 'New password should not contain common dictionary words.'
                    },
                    {
                        type   : 'trivial',
                        prompt : 'New password should not contain trivial words.'
                    },
                    {
                        type   : 'personal',
                        prompt : 'New password should not contain personal information. i.e. usernames, names.'
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