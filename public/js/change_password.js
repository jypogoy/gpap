$(function() {
    
    if ($('.error.message').html() != '') {
        $('.error.message').addClass('visible');
    } else {
        $('.error.message').removeClass('visible');
    }

    $('.ui.form')
    .form({
        fields: {
            current_password: {
                identifier: 'current_password',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Current password is required.'
                    },
                    {
                        type   : 'minLength[10]',
                        prompt : 'Current password must be at least {ruleValue} characters.'
                    },
                    {
                        type   : 'regExp',
                        value  : '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$',
                        prompt : 'Current password should be alphanumeric and contains at least 1 upper case letter and a special character.'
                    },
                    // {
                    //     type   : 'byLastSix',
                    //     prompt : 'Current password is already used.'
                    // },
                    // {
                    //     type   : 'withinDayChange',
                    //     prompt : 'Cannot change password anymore.'
                    // },
                    // {
                    //     type   : 'onDict',
                    //     prompt : 'Current password should not contain common dictionary words.'
                    // },
                    // {
                    //     type   : 'trivial',
                    //     prompt : 'Current password should not contain trivial words.'
                    // },
                    // {
                    //     type   : 'personal',
                    //     prompt : 'Current password should not contain personal information. i.e. usernames, names.'
                    // }
                ]
            },
            new_password: {
                identifier: 'new_password',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'New password is required.'
                    },
                    {
                        type   : 'minLength[10]',
                        prompt : 'New password must be at least {ruleValue} characters.'
                    },
                    {
                        type   : 'not[current_password]',
                        prompt : 'Your new password must be different from your current.'
                    },
                    {
                        type   : 'regExp',
                        value  : '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$',
                        prompt : 'New password should be alphanumeric and contains at least 1 upper case letter and a special character.'
                    }
                ]
            },
            confirm_password: {
                identifier: 'confirm_password',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Confirm password is required.'
                    },
                    {
                        type   : 'match[new_password]',
                        prompt : 'Your specified new passwords mismatched.'
                    }
                ]
            }
        }
    });

    // var errors = [];
    $('.submit.button').click(function(e) {
        if ($('.ui.form').form('is valid')) {
            var form = $('#changePassForm');
            $(form).attr('action', '../security/updatepassword');    
            $(form).attr('method', 'POST');
            $(form).submit();
        }
    });    

});

function validatePassword(fieldId, isCurrent) {
    
    var withError = false;
    var erroMsg = $('.error.message');
    erroMsg.html('');
    erroMsg.append('<ul class="list error-list"></ul>');
    
    var password = $('#' + fieldId).val();

    $.when(        
        checkByLastSix(password).then(function(hasMatch) {      
            if (hasMatch) {
                $('.error-list').append('<li class="' + fieldId+ '_msg">' + (isCurrent ? 'Current' : 'New') + ' password is already used.</li>');
                withError = true;
            }
        }),

        checkSameDayChange(password).then(function(count) {
            if (count > 0) {
                $('.error-list').append('<li class="' + fieldId + '_msg">Cannot change password anymore.</li>');                        
                withError = true;
            }
        }),

        checkPassDict(password).then(function(count) {
            if (count > 0) {
                $('.error-list').append('<li class="' + fieldId + '_msg">' + (isCurrent ? 'Current' : 'New') + '  password should not contain common dictionary words.</li>');
                $('.current_password_field').addClass('error');
                withError = true;
            }
        }),

        // checkTrivial(password).then(function(count) {
        //     if (count > 0) {
        //         $('.error-list').append('<li class="' + fieldId  + '_msg">' + (isCurrent ? 'Current' : 'New') + '  password should not contain trivial words.</li>');
        //         $('.current_password_field').addClass('error');
        //         withError = true;
        //     }
        // }),
        
        checkPersonal(password).then(function(count) {
            if (count > 0) {
                $('.error-list').append('<li class="' + fieldId + '_msg">' + (isCurrent ? 'Current' : 'New') + '  password should not contain personal information. i.e. usernames, names.</li>');
                $('.current_password_field').addClass('error');
                withError = true;
            }
        })

    ).then(function() {
        if (withError) {
            $('.' + fieldId + '_field').addClass('error');
            $(erroMsg).addClass('visible');
        } else {
            if ($('#new_password').val() != $('#confirm_password').val()) {
                $('.error-list').append('<li class="' + fieldId + '_msg">Passwords do not match.</li>');
                $('.new_password_field').addClass('error');
                $('.confirm_password_field').addClass('error');
            } else {
                $('.' + fieldId + '_field').removeClass('error');
                $('.confirm_password_field').removeClass('error');
                $(erroMsg).removeClass('visible');                
                // var form = $('#changePassForm');
                // console.log(form)
                // $(form).attr('action', '../security/updatepassword');    
                // $(form).attr('method', 'POST');
                // $(form).submit();
            }               
        } 
    });
}