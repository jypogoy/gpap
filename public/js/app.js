$(function () {
    toastr.options = { 
        "positionClass" : "toast-top-center toastr-custom-pos"
    };

    $('.ui.checkbox').checkbox();       
    
    $('.user-profile-dropdown').dropdown();

    $('.policy').click(function(e) {
        e.preventDefault();
        PolicyModal.show();
    });

    var msgEl = $('.ui.message');
    if ($(msgEl).html() != '') {
        if ($(msgEl).hasClass('error')) {
            composeMessagePrompt('error', $(msgEl).html());
        } else if ($(msgEl).hasClass('success')) {
            composeMessagePrompt('success', $(msgEl).html());
        } else if ($(msgEl).hasClass('notice')) {
            composeMessagePrompt('info', $(msgEl).html());
        } else if ($(msgEl).hasClass('warning')) {
            composeMessagePrompt('warning', $(msgEl).html());
        }
    }
});

function composeMessagePrompt(type, msg) {
    $(document.body).append('<script>' +
                        '$(function () {' +
                            'toastr.options = {' +
                                '"positionClass" : "toast-top-center toastr-custom-pos"' +
                            '};' +
                            'toastr.' + type + '("' + msg + '");' +
                        '})' +
                    '</script>');
}

var PolicyModal = {
    show : function () {         
        
        $('#modal_task_label').html($('#task_id_dropdown').dropdown('get text'));
        
        $('.modal.policy')
        .modal('setting',
        {
            inverted : true,
            closable : true,
            onDeny : function(){
                // Do nothing
            },
            onApprove : function() {
                //window.location = 'boards/delete/' + id;
            }
        })
        .modal('setting', { detachable:false })
        .modal('show');
    },
    hide : function () {
        $('.modal.policy').modal('hide');
    }
}