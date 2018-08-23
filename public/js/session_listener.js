var global = parseInt($('#session_lifetime').val());    
var untilTimeout = parseInt($('#until_timeout').val());    
var stopInterval = false;
var session_timer;

$(function() {
    initListeners();
    runInterval();
});

function runInterval() {
    if (stopInterval == false) {
        setTimeout(function() {
            noMovement();
            runInterval();
        }, 1000);
    }
}

// function beingInterval() {
//     session_timer = setInterval(function() { 
//         if (session_interval_stopped) {
//             clearInterval(session_timer);
//         } else {
//             noMovement();
//         }
//     }, 1000);
// }

function noMovement() {
    
    console.log('Detecting movement... ' + global + ' second(s) until timeout.');
    
    if (global == 0) {     
        stopInterval = true;            
        signOut();

    } else if (global <= untilTimeout) { // Give a minute for a user to extend session.         
        if ($('.extension.transition.visible').length == 0) {               
            
            // Hide or close any displayed modals.
            $('.modal').hide();

            buildModal();                     

            $('.modal.extension')
            .modal({
                inverted : true,
                closable : false,
                autofocus: true,
                observeChanges : true, // <-- Helps retain the modal position on succeeding show.
                onDeny : function(){
                    signOut();
                },
                onApprove : function() {                          
                    resetGlobal();
                    initListeners();
                    return;
                }
            })
            .modal('show');

            // Remove listening events.
            unbindListeners();
        }
        $('#countDown').html(global);
    }
    
    global--;        
}

function buildModal() {

    $('.extension').remove();

    $(document.body).append('<div class="ui tiny modal extension"><i class="close icon"></i><div class="header"><i class="time icon"></i>Need More Time?</div><div class="content extension-text" style="min-height: 30px;"></div><div class="actions"><div class="ui positive button">Stay Signed In</div><div class="ui negative button">Sign Out</div></div></div>');
                
    $('.extension-text').html(
        '<p>Your session is about to expire. You will automatically signed out in</p>' +
        '<p id="countDown" style="font-size: 18pt; font-weight: bold; margin-left: 40px;"></p>' + 
        '<p>To continue your session, select <b>Stay Signed In</b></p>'
    );
}

function signOut() {
    // Force end session and clear any persistent objects.
    $.post('/gpap/session/end/');    
    window.location = '/gpap/session/expired/'; // Redirect to login page.
}

function resetGlobal() {    
    global = $('#session_lifetime').val();        
    console.log('>> Session counter reset to ' + global + ' seconds.');    
}    

function unbindListeners() {
    $('html').off('mousemove');
    $('html').off('click');
    $('html').off('keyup');
}

function initListeners() {

    $('html').mousemove(function(event){
        resetGlobal();
    });

    $('html').click(function(event){
        resetGlobal();
    });

    $('html').keyup(function(event){
        resetGlobal();
    });
}

// $(document.body).append('<div class="ui tiny modal expired"><i class="close icon"></i><div class="header"><i class="lock icon"></i>Secure Session Expired!</div><div class="content expired-text" style="min-height: 30px;"></div><div class="actions"><div class="ui positive button">OK</div></div></div>');

        // $('.expired-text').html('<p>Your secure session has expired due to inactivity.</p><p>Click OK to login and re-establish a new session.</p>');
        // $('.modal.expired')
        // .modal({
        //     inverted : true,
        //     closable : false,
        //     autofocus: true,
        //     observeChanges : true, // <-- Helps retain the modal position on succeeding show.
        //     onDeny : function(){
        //         // Do nothing...
        //     },
        //     onApprove : function() {
        //         window.location = '/gpap/session/expired/'; // Redirect to login page without any message.
        //     }
        // })
        // .modal('show');       