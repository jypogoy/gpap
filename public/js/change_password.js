$(function() {

    function checkMatch(value) {
        var d = $.Deferred();

        $.post('../session/nondict/', { 'keyword': value }, function (hasMatch) {
            d.resolve(hasMatch);
        });

        return d.promise();
    }

    function getDictionary() {
        var d = $.Deferred();

        $.post('../dictionary/list', function (dict) {
            d.resolve(dict);
        });

        return d.promise();
    }

    $.fn.form.settings.rules.nonDict = function(value) {
        var isDict = true;
        
        $.when(getDictionary()).done(function(dict) {
            $.each(dict, function(i, word) {
                console.log(value + ' : ' + word.dictionaryWord)
                if (value.indexOf(word.dictionaryWord) != -1) {
                    console.log('Match')
                }
            });
        });
        
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