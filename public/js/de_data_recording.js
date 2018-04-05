function gatherHeaderValues() {
    var fields = $('.header-field');
    var data = {};
    data.data_entry_id = $('#data_entry_id').val();
    data.batch_id = $('#batch_id').val();    
    $.each(fields, function(i, field) {        
        if (field.id.indexOf('date') != -1) {
            data[field.id] = $.datepicker.formatDate('yy-mm-dd', new Date(field.value));
        } else {
            data[field.id] = field.value;
        }
    });
    data.id = $('#merchant_header_id').val();
    return data;
}

function saveBatch(isSaveNew, isComplete) {

    saveSlip(); // Save the current content. See de_data_navigation.js
   
    $.ajax()
    .then(function() { // Write the header.
        return $.post('../merchant_header/save', gatherHeaderValues(), function(headerId) {
            return headerId;
        });
    })
    .then(function(headerId) { // Write transactions.
        if ($('#batch_pull_reason_id').val() == 0 || $('#batch_pull_reason_id').val() == '') { // Record transactions if no specified batch pull reason.
            if($.isNumeric(headerId)) { // Check if the newly created header id was created.
                // Make sure to delete previously recorded transactions.
                $.post('../transaction/deleteprevious/' + headerId, function (msg) {
                    // Do nothing...
                })
                .then(function() {
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
                        
                        // Write the transaction details.
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
                });
            } else {
                toastr.error(headerId);
            }
        }
    })
    .done(function() {
        if (isComplete) {
            var data = {};
            data.entry_id = $('#data_entry_id').val();
            data.batch_id = $('#batch_id').val();
            $.post('../de/complete/', data,function (msg) {  
                if (msg.indexOf('success') != -1) {                                               
                    toastr.success(msg);  
                    if (isSaveNew) {
                        getNewBatch();
                    } else {
                        window.location = '../de/redirectsuccess/' + true;
                    }       
                } else {
                    toastr.success('Unable to complete the selected batch.');
                }       
            });
        } else {
            if (isSaveNew) {
                getNewBatch();
            } else {
                window.location = '../de/redirectsuccess/' + true;
            }
        }       
    });    

}

function getNewBatch() {
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
}

function saveBatch2(isSaveNew) {    

    // Write the header details.
    $.post('../merchant_header/save', gatherHeaderValues(), function (headerId) {
        
        if ($('#batch_pull_reason_id').val() == 0 || $('#batch_pull_reason_id').val() == '') { // Record transactions if no specified batch pull reason.
            
            if($.isNumeric(headerId)) { // Check if the newly created header id was created.
                
                // Make sure to delete previously recorded transactions.
                $.post('../transaction/deleteprevious/' + headerId, function (msg) {
                    // Do nothing...
                })
                .done(function (msg) {
                    
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
                    
                        // FOR CONFIRMATION: IS TRANSACTION ID ALWAYS REQUIRED?                        
                    
                        // Write the transaction details.
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
                })
                .fail(function (xhr, status, error) {
                    toastr.error(error);
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
            window.location = '../de/redirectsuccess/' + isSuccess;
        }

    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    }); 
}

function completeBatch(isCompleteNew) {

}