function gatherHeaderValues() {
    var fields = $('.header-field');
    var data = {};
    data.batch_id = $('#batch_id').val();
    $.each(fields, function(i, field) {        
        if (field.id.indexOf('date') != -1) {
            data[field.id] = $.datepicker.formatDate('yy-mm-dd', new Date(field.value));
        } else {
            data[field.id] = field.value;
        }
    });
    return data;
}

function saveBatch(isSaveNew) {
   
    saveSlip(); // Save the current content
   
    $.post('../merchant_header/save', gatherHeaderValues(), function (headerId) {

        // Make sure to delete previously recorded transactions.
        $.post('../transaction/deleteprevious/' + headerId, function (msg) {
            // Do nothing...
        })
        .done(function (msg) {

            if ($('#batch_pull_reason_id').val() == 0 || $('#batch_pull_reason_id').val() == '') { // Record transactions if no specified batch pull reason.
                if($.isNumeric(headerId)) { // Check if the newly created header id was created.
                    slipMap.forEach(function(fieldValueMap, index) {
                        
                        var data = {};
                        data['merchant_header_id'] = headerId;
                        data['sequence'] = index;
                        fieldValueMap.forEach(function(value, id) {
                            if (id.indexOf('date') != -1) {
                                data[id] = $.datepicker.formatDate('yy-mm-dd', new Date(value));
                            } else {
                                data[id] = value;
                            }      
                        });
                        
                        // Write all new transactions.
                        $.post('../transaction/save', data, function (msg) {
                            if (msg.indexOf('success')) {
                                //toastr.success(msg);    
                            } else {
                                toastr.error(msg);
                            }
                        })
                        .done(function (msg) {
                            // Do nothing...
                        })
                        .fail(function (xhr, status, error) {
                            toastr.error(error);
                        });                                     
                    });
                } else {
                    toastr.error(headerId);
                }
            }

            if (isSaveNew) {
                $.post('../batch/getavailable/' + ($('#session_task_name').val().indexOf('Entry') != -1 ? 'ENTRY' : ''), function (data) {
                    if (data) {
                        window.location = '../de/' + data.id;
                    } else {
                        window.location = '../de/redirectnonext/' + $('#session_task_name').val();
                    }                
                })
                .done(function (msg) {
                    // Do nothing...
                })
                .fail(function (xhr, status, error) {
                    toastr.error(error);
                });
            } else {
                window.location = '../de/redirectsuccess/' + (msg > 0 ? true : false);
            }

        })
        .fail(function (xhr, status, error) {
            toastr.error(error);
        });          
    })
    .done(function (msg) { 
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

function completeBatch(isCompleteNew) {

}