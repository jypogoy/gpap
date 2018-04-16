function saveBatch(isSaveNew, isComplete) {

    saveSlip(); // Save the current content. See de_data_navigation.js   

    // Record new header.
    $.when(writeHeader())
    .done(function(headerId) {
        if ($('#batch_pull_reason_id').val() == 0 || $('#batch_pull_reason_id').val() == '') { // Record transactions if no specified batch pull reason.
            // Clear previously recorded transactions to eliminate repitition.
            $.when(delPreviousTrans(headerId))
            .done(function(isSuccess) {
                if (isSuccess) {
                    // Record new transactions.
                    $.when(writeSlips(headerId))
                    .done(function(isSuccess) {
                        if (!isSuccess) {
                            toastr.error('Unable to record transactions.');
                        }
                    });
                } else {
                    toastr.error('Unable to clear previous recorded transactions.');
                }
            });
        }

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
                    toastr.error('Unable to complete the this batch.');
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

function writeHeader() {
    var d = $.Deferred();

    $.post('../merchant_header/save', gatherHeaderValues(), function(headerId) {
        d.resolve(headerId);
    }).fail(function (xhr, status, error) {
        toastr.error(error);
    });  

    return d.promise();
}

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

function delPreviousTrans(headerId) {
    var d = $.Deferred();

    $.post('../transaction/deleteprevious/' + headerId, function (result) {
        d.resolve(result == 1 ? true : false);
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });

    return d.promise();
}

function writeSlips(headerId) {
    var d = $.Deferred();

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
        $.post('../transaction/save', data, function (result) {
            d.resolve(result == 1 ? true : false);
        })
        .fail(function (xhr, status, error) {
            toastr.error(error);
        });                                     
    });

    return d.promise();
}

function saveBatch1(isSaveNew, isComplete) {

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
                    toastr.error('Unable to complete the this batch.');
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
    $.post('../batch/getavailable/' + ($('#session_task_name').val().indexOf('Entry') != -1 ? 'ENTRY' : 'VERIFY'), function (data) {
        if (data) {
            redirectBack(data.id)
        } else {
            window.location = '../de/redirectnonext/' + $('#session_task_name').val();
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        console.log(error)
        toastr.error(error);
    });
}

function redirectBack(batchId) {
    var form = $('#redirectForm');
    $(form).attr('action', '../de/' + batchId);    
    $(form).attr('method', 'POST');
    $(form).submit();
}