$(function () {
    toastr.options = { 
        "positionClass" : "toast-top-center toastr-custom-pos"
    };

    $('.ui.checkbox').checkbox();       
    
    $('.user-profile-dropdown').dropdown();

    $('.policy').click(function(e) {
        console.log('TEST')
        e.preventDefault();
        $('.modal.policy')
        .modal({
            inverted : true,
            closable : true,
            observeChanges : true, // <-- Helps retain the modal position on succeeding show.
            onDeny : function(){
                // Do nothing
            },
            onApprove : function() {
                // Do nothing
            }
        })
        .modal('show');
    });
});