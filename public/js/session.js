$(function() {

    // $('.ui.form')
    // .form({
    //     fields: {
    //         username: {
    //             identifier: 'username',
    //             rules: [
    //                 {
    //                     type   : 'empty',
    //                     prompt : 'Please specify your username.'
    //                 }
    //             ]
    //         },
    //         password: {
    //             identifier: 'password',
    //             rules: [
    //                 {
    //                     type   : 'empty',
    //                     prompt : 'Please specify your password.'
    //                 }
    //             ]
    //         }
    //     }
    // });
    if($('.alert-danger').is(':visible')) {
        $('.field').addClass('error');
    } else {
        $('.field').removeClass('error');
    }

});