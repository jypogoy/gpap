$(function() {

    var global = $('#session_lifetime').val();

    function noMovement() {
        if (global == 0) { 
            
            // Force end session and clear any persistent objects.
            $.post('/gpap/session/end/');    
            
            $(document.body).append('<div class="ui tiny modal expired"><i class="close icon"></i><div class="header"><i class="lock icon"></i>Secure Session Expired!</div><div class="content expired-text" style="min-height: 30px;"></div><div class="actions"><div class="ui positive button">OK</div></div></div>');

            $('.expired-text').html('<p>Your secure session has expired due to inactivity.</p><p>Click OK to login and re-establish a new session.</p>');
            $('.modal.expired')
            .modal({
                inverted : true,
                closable : true,
                autofocus: false,
                observeChanges : true, // <-- Helps retain the modal position on succeeding show.
                onDeny : function(){
                    // Do nothing...
                },
                onApprove : function() {
                    window.location = '/gpap/session/expired/'; // Redirect to login page without any message.
                }
            })
            .modal('show');        

            clearInterval(timer); 
        } else {
            global--;
        }
    }

    function resetGlobal() {
        global = $('#session_lifetime').val();            
    }

    $(document).ready(function(){
        $('html').mousemove(function(event){
            resetGlobal();
        });

        $('html').click(function(event){
            resetGlobal();
        });

        $('html').keyup(function(event){
            resetGlobal();
        });
    });

    var timer = setInterval(function(){ noMovement() }, 1000);

});