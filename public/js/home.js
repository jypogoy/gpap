$(function () {

    toastr.options = { 
        "positionClass" : "toast-top-center toastr-custom-pos"
    };

    $('.loader').fadeOut();

    $('.get-batch').click(function(e) {        
        loadAvailableBatches();
    });
    
    getUserTasks();        

});

function getUserTasks() {
    $.post('user_task/getbyuser/' + $('#user_id').val(), function (data) {   
        if (!data) {
            toastr.warning('The search did not match any assigned tasks.'); 
        } else {
            
            $(data).appendTo('.user-tasks'); // Add the task selection component
            
            if ($('.task_menu').children().length > 0) {

                $('#task_id_dropdown').dropdown({ // See user_tasks_selection.volt
                    onChange: function() {
                        var value = $(this).dropdown('get value');   
                        loadUserEntries(value);
                    },
                });
                
                // Check if task filtering was previously done to avoid redundancy.
                var sessionTaskId = $('#session_task_id').val();
                
                var activeTaskId;
                if (sessionTaskId != 'undefined' && sessionTaskId != '' && sessionTaskId > 0) {
                    activeTaskId = sessionTaskId;
                    $('#task_id').val(sessionTaskId);
                    $('#task_id_dropdown').dropdown('set selected', sessionTaskId);
                } else {
                    // Set the default selected task.
                    var firstOpt = $('.task_menu').children()[0];
                    $(firstOpt).addClass('active selected');
                    
                    activeTaskId = $(firstOpt).attr('data-value');
                    $('#task_id').val(activeTaskId);
                    
                    $('.default.text').html($(firstOpt).html());
                }                            
                
                // Load all work in progress.
                if (activeTaskId) {
                    loadUserEntries(activeTaskId);    
                } else {
                    $('.deListBody').empty();                
                    $('.deListBody').append('<tr><td colspan="6">No records found.</td></tr>');
                }        
                $('.get-batch').removeClass('hidden');
            } else {
                toastr.info('You do not have any assigned tasks.'); 
                $('.user-tasks').empty();
                $('.get-batch').addClass('hidden');
                $('.deListBody').empty();  
                $('.deListBody').append('<tr><td colspan="6">No records found.</td></tr>');
            }    
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });   
}

function loadUserEntries(taskId) {
    var wrapper = $('.deListBody');
    $.post('data_entry/getbyusertask/' + taskId, function (data) {
        $(wrapper).empty();
        if (!data) {
            $(wrapper).append('<tr><td colspan="6">No records found.</td></tr>');
        } else {
            if (data.indexOf('alert') != -1) {
                toastr.error(data);
            } else {                                
                $(data).appendTo(wrapper);
            }            
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });   
}

var BatchModal = {
    show : function () {         
        
        $('#modal_task_label').html($('#task_id_dropdown').dropdown('get text'));
        
        var modal = $('.modal:not(div.complete)');

        $(modal)
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
        $(modal).modal('hide');
    }
}

function loadAvailableBatches() {
    var activeTaskName = $('#task_id_dropdown').dropdown('get text');
    $.post('batch/listavailable/' + (activeTaskName.indexOf('Entry') != -1 ? 'ENTRY' : 'VERIFY'), function (data) {
        if (!data) {
            toastr.warning('The search did not match any batch.');
            BatchModal.hide();      
        } else {
            $('.available-batch-content').empty();
            $('.available-batch-content').append(data);
        }                
    })
    .done(function (msg) {
        BatchModal.show();
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

function complete(entryId, batchId) {
    
    $('.custom-text').html('<p>Are you sure you want to complete batch <strong>' + batchId + '</strong>? Click OK to proceed.</p>');

    $('.modal:not(div.available)')
    .modal({
        inverted : true,
        closable : true,
        observeChanges : true, // <-- Helps retain the modal position on succeeding show.
        onDeny : function(){
            // Do nothing
        },
        onApprove : function() {
            var data = {};
            data.entry_id = entryId;
            data.batch_id = batchId;
            data.isFromHome = true;
            $.post('de/complete/', data,function (data) {
                // Do nothing...             
            });
        }
    })
    .modal('show');
}