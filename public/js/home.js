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

var activeTaskId;
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
                $('#batchCount').removeClass('hidden');
            } else {
                toastr.info('You do not have any assigned tasks.'); 
                $('.user-tasks').empty();
                $('.get-batch').addClass('hidden');
                $('#batchCount').addClass('hidden');
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
        countAvailableByTask();
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });   
}

function countAvailableByTask() {
    var activeTaskName = $('#task_id_dropdown').dropdown('get text');
    if (activeTaskName.indexOf('Balancing') != -1) {
        $.post('batch/countwithvariance', function (count) {
            $('#batchCount').html(count);
            if (count > 0) {                
                $('#batchCount').addClass('green');
                $('.get-batch').removeClass('disabled')
            } else {
                $('#batchCount').removeClass('green');
                $('.get-batch').addClass('disabled')
            }           
        })
        .done(function (msg) {
            // Do nothing...
        })
        .fail(function (xhr, status, error) {
            toastr.error(error);
        }); 
    } else {
        $.post('batch/countavailable/' + (activeTaskName.indexOf('Entry') != -1 ? 'ENTRY' : 'VERIFY'), function (count) {
            $('#batchCount').html(count);
            if (count > 0) {                
                $('#batchCount').addClass('green');
                $('.get-batch').removeClass('disabled')
            } else {
                $('#batchCount').removeClass('green');
                $('.get-batch').addClass('disabled')
            }  
        })
        .done(function (msg) {
            // Do nothing...
        })
        .fail(function (xhr, status, error) {
            toastr.error(error);
        });   
    }
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
    if (activeTaskName.indexOf('Balancing') != -1) {
        $.post('batch/listwithvariance/', function (data) {
            if (!data) {
                toastr.warning('The search did not match any batch.');
                BatchModal.hide();      
            } else {
                if (data.indexOf('No records') != -1) {
                    toastr.info('There are no more available batches for ' + activeTaskName + '.');                    
                } else {
                    $('.available-batch-content').empty();
                    $('.available-batch-content').append(data);
                    BatchModal.show();
                }
            }                
        })
        .done(function (msg) {
            // Do nothing...
        })
        .fail(function (xhr, status, error) {
            toastr.error(error);
        });
    } else {
        $.post('batch/listavailable/' + (activeTaskName.indexOf('Entry') != -1 ? 'ENTRY' : 'VERIFY'), function (data) {
            if (!data) {
                toastr.warning('The search did not match any batch.');
                BatchModal.hide();      
            } else {
                if (data.indexOf('No records') != -1) {
                    toastr.info('There are no more available batches for ' + activeTaskName + '.');                    
                } else {
                    $('.available-batch-content').empty();
                    $('.available-batch-content').append(data);
                    BatchModal.show();
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
}

function complete(fromHome, actionEl, entryId, batchId) {
    
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
            $.post('de/complete/', data,function (msg) {  
                if (msg.indexOf('success') != -1) {       
                    if (fromHome) {
                        var row = $(actionEl).closest('tr');
                        row.effect('highlight', {}, 500, function(){ // See app.css for highlight class
                            $(this).fadeOut('fast', function(){            
                                var table = $(this).closest('table');
                                $(this).remove();        
                                loadUserEntries(activeTaskId);
                            });
                        });                          
                    }
                    toastr.success(msg);         
                } else {
                    toastr.error('Unable to complete Batch <strong>' + batchId + '</strong>.');
                }       
            });
        }
    })
    .modal('show');
}

function begin(batchId) {
    var form = $('#beginForm');
    $(form).attr('action', 'de/' + batchId);    
    $(form).attr('method', 'POST');
    $(form).submit();
}