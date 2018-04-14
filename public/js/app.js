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
});

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