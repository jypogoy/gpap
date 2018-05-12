function saveBatch(isSaveOnly, isSaveNew, isComplete) {

    saveSlip(); // Save the current content. See de_data_navigation.js   
    
    // Record new header.
    $.when(writeHeader())
    .done(function(headerId) {        
        // Clear previously recorded transactions to eliminate repetition.
        $.when(delPreviousTrans(headerId))
        .done(function(isSuccess) {
            if (isSuccess) {
                // Record new transactions. 
                $.when(writeSlips(headerId))
                .done(function(isSuccess) {
                    if (!isSuccess) {
                        toastr.error('Unable to record transactions.');
                    } else {
                        if (isComplete) {
                            var data = {};
                            data.entry_id = $('#data_entry_id').val();
                            data.batch_id = $('#batch_id').val();
                            $.post('../de/complete/', data,function (msg) {  
                                if (msg.indexOf('success') != -1) {        
                                                                        
                                    // Record a copy of the DCN information to maintain uniqueness.
                                    // These records will be used to validate new transaction DCNs.
                                    recordDCN().then(function(isSuccess) {
                                        if (isSuccess) {
                                            toastr.success(msg);  
                                            if (isSaveNew) {
                                                getNewBatch();
                                            } else {
                                                window.location = '../de/redirectsuccess/' + false;
                                            } 
                                        } else {
                                            toastr.error('Unable to record DCN.');
                                        }      
                                    })
                                    .done(function (msg) {
                                        // Do nothing...
                                    })
                                    .fail(function (xhr, status, error) {
                                        toastr.error(error);
                                    });                                 
                                } else {
                                    toastr.error('Unable to complete the this batch.');
                                }       
                            });
                        } else {
                            if (isSaveOnly) {
                                toastr.success('Batch was saved successfully.'); 
                            } else {
                                if (isSaveNew) {
                                    getNewBatch();
                                } else {
                                    window.location = '../de/redirectsuccess/' + true;
                                }
                            }
                        }
                    }                        
                });
            } else {
                toastr.error('Unable to clear previous recorded transactions.');
            }                   
        });               
    });
}

function saveBatch_deprecated(isSaveOnly, isSaveNew, isComplete) {

    saveSlip(); // Save the current content. See de_data_navigation.js   
    
    // Record new header.
    $.when(writeHeader())
    .done(function(headerId) {
        if ($('#batch_pull_reason_id').val() > 0 || $('#batch_pull_reason_id').val() != '') { // Record transactions if no specified batch pull reason.
            // Clear previously recorded transactions to eliminate repetition.
            $.when(delPreviousTrans(headerId))
            .done(function(isSuccess) {
                if (isSuccess) {
                    if (isComplete) {
                        var data = {};
                        data.entry_id = $('#data_entry_id').val();
                        data.batch_id = $('#batch_id').val();
                        $.post('../de/complete/', data,function (msg) {  
                            if (msg.indexOf('success') != -1) {                                               
                                
                                // Record a copy of the DCN information to maintain uniqueness.
                                // These records will be used to validate new transaction DCNs.
                                recordDCN();
                                
                                toastr.success(msg);  
                                if (isSaveNew) {
                                    getNewBatch();
                                } else {
                                    window.location = '../de/redirectsuccess/' + false;
                                }   
                            } else {
                                toastr.error('Unable to complete the this batch.');
                            }       
                        });
                    } else {
                        if (isSaveOnly) {
                            toastr.success('Batch was saved successfully.'); 
                        } else {
                            if (isSaveNew) {
                                getNewBatch();
                            } else {
                                window.location = '../de/redirectsuccess/' + true;
                            }
                        }
                    }
                } else {
                    toastr.error('Unable to clear previous recorded transactions.');
                }    
            });
        } else {
            // Clear previously recorded transactions to eliminate repetition.
            $.when(delPreviousTrans(headerId))
            .done(function(isSuccess) {
                if (isSuccess) {
                    // Record new transactions. 
                    $.when(writeSlips(headerId))
                    .done(function(isSuccess) {
                        if (!isSuccess) {
                            toastr.error('Unable to record transactions.');
                        } else {
                            if (isComplete) {
                                var data = {};
                                data.entry_id = $('#data_entry_id').val();
                                data.batch_id = $('#batch_id').val();
                                $.post('../de/complete/', data,function (msg) {  
                                    if (msg.indexOf('success') != -1) {        
                                        
                                        // Record a copy of the DCN information to maintain uniqueness.
                                        // These records will be used to validate new transaction DCNs.                                        
                                        recordDCN();

                                        toastr.success(msg);  
                                        if (isSaveNew) {
                                            getNewBatch();
                                        } else {
                                            window.location = '../de/redirectsuccess/' + false;
                                        }   
                                    } else {
                                        toastr.error('Unable to complete the this batch.');
                                    }       
                                });
                            } else {
                                if (isSaveOnly) {
                                    toastr.success('Batch was saved successfully.'); 
                                } else {
                                    if (isSaveNew) {
                                        getNewBatch();
                                    } else {
                                        window.location = '../de/redirectsuccess/' + true;
                                    }
                                }
                            }
                        }                        
                    });
                } else {
                    toastr.error('Unable to clear previous recorded transactions.');
                }                   
            });
        }                    
    });
}

function writeHeader() {
    var d = $.Deferred();

    $.post('../merchant_header/save', gatherHeaderValues(), function(headerId) {
        d.resolve(headerId);
    })
    .fail(function (xhr, status, error) {
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
            if (field.value && (field.id.indexOf('card') != -1 || field.id.indexOf('amount') != -1)) {
                data[field.id] = unformatValue(field.value); // See utils.js
            } else {
                data[field.id] = field.value;
            }            
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

    // Assemble all transaction details.
    var params = {};
    params.collection = [];
    slipMap.forEach(function(fieldValueMap, index) {                        
        var data = {};
        data['merchant_header_id'] = headerId;
        data['sequence'] = index;
        fieldValueMap.forEach(function(value, id) {
            if (id.indexOf('date') != -1) {
                //data[id] = $.datepicker.formatDate('yy-mm-dd', new Date(value));
                data[id] = value;
            } else {
                if (value && (id.indexOf('card') != -1 || id.indexOf('amount') != -1)) {
                    data[id] = unformatValue(value); // See utils.js
                } else {
                    data[id] = value;
                }
            }      
        });        
        params.collection.push(data);                                             
    });

    // Write the transaction details.
    $.post('../transaction/save', params, function (result) {
        d.resolve(result == 1 ? true : false);
    });

    return d.promise();
}

function getNewBatch() {
    $.post('../batch/getavailable/' + $('#session_task_name').val(), function (data) {
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
        toastr.error(error);
    });
}

function redirectBack(batchId) {
    var form = $('#redirectForm');
    $(form).attr('action', '../de/' + batchId);    
    $(form).attr('method', 'POST');
    $(form).submit();
}

function recordDCN() {

    var d = $.Deferred();

    var params = {};
    params.batch_id = $('#batch_id').val();
    params.task_id = $('#session_task_id').val();
    params.dcn = $('#dcn').val();
    params.merchant_number = $('#merchant_number').val();
    params.region_code = $('#region').val();  
    params.amount = unformatValue($('#deposit_amount').val());
    params.image_path = imgArray[0].path;                                 

    $.post('../dcn/record/', params, function (isSuccess) {
       d.resolve(isSuccess);      
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });

    return d.promise();
}