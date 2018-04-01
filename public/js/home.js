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
            $(data).appendTo('.user-tasks');
            
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
            loadUserEntries(activeTaskId);
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
        
        $('.modal.batch')
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
        $('.modal.batch').modal('hide');
    }
}

function loadAvailableBatches() {
    var activeTaskName = $('#task_id_dropdown').dropdown('get text');
    $.post('batch/listavailable/' + (activeTaskName.indexOf('Entry') != -1 ? 'ENTRY' : ''), function (data) {
        if (!data) {
            toastr.warning('The search did not match any batch.');
            $('.modal.batch').modal('hide');           
        } else {
            $('.content').empty();
            $('.content').append(data);
        }                
    })
    .done(function (msg) {
        BatchModal.show();
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}