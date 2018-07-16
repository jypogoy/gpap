function saveBatch(isSaveOnly, isSaveNew, isComplete) {

    saveSlip(); // Save the current content. See de_data_navigation.js   
    
    // Record new header.
    $.when(writeHeader())
    .done(function(headerId) {        
        // Record new transactions. 
        $.when(writeSlips(headerId))
        .done(function(isSuccess) {
            if (!isSuccess) {
                toastr.warning('Unable to record transactions. Kindly retry.');
            } else {
                if (isComplete) {
                    var params = {};
                    params.entry_id = $('#data_entry_id').val();
                    params.batch_id = $('#batch_id').val();
                    params.task_id = $('#session_task_id').val();
                    params.dcn = $('#dcn').val();
                    params.merchant_number = $('#merchant_number').val();
                    params.region_code = $('#region').val();  
                    params.amount = unformatValue($('#deposit_amount').val());
                    params.image_path = imgArray[0].path;              

                    $.post('../de/complete/', params, function (isSuccess) {  
                        if (isSuccess) {                                                                                       
                            toastr.success('Batch was completed successfully!');  
                            if (isSaveNew) {
                                getNewBatch();
                            } else {
                                window.location = '../de/redirectsuccess/' + false;
                            }                             
                        } else {
                            toastr.error('Unable to complete this batch.');
                        }       
                    });
                } else {
                    
                    // For Edits Only: Record the current editor for review purposes.
                    if ($('#session_from_edits').val()) {
                        recordEditor();
                    }
                    
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
    data.image_path = imgArray[0].path;
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
    params.header_id = headerId;
    params.collection = [];
    slipMap.forEach(function(fieldValueMap, index) {                        
        var data = {};
        //data['merchant_header_id'] = headerId;
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

    // Assember DCN details.
    params.batch_id = $('#batch_id').val();
    params.task_id = $('#session_task_id').val();
    params.dcn = $('#dcn').val();
    params.merchant_number = $('#merchant_number').val();
    params.region_code = $('#region').val();  
    params.amount = unformatValue($('#deposit_amount').val());
    params.image_path = imgArray[0].path;    

    // Write the transaction details.
    $.post('../transaction/save', params, function (result) {
        d.resolve(result == 1 ? true : false);
    });

    return d.promise();
}

function getNewBatch() {
    //setTimeout(function() {
        $.post('../batch/getnextavailable/' + $('#session_task_id').val(), function (data) {
            if (data) {            
                if (data.id) {
                    redirectBack(data.id); // If batch is still available, proceed to capture.
                } else {
                    getNewBatch(); // If batch is already asigned to a different user, get another.        
                }            
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
    //}, Math.floor(Math.random() * 300)); // Delay between 0 to .3 second.
}

function getNewBatch_OLD() {
    $.post('../batch/getnextavailable/' + $('#session_task_id').val(), function (data) {
        if (data && data.id) {
            var params = {};
            params.task_id = $('#session_task_id').val();
            params.batch_id = data.id;
            $.post('../batch/isavailable/', params, function (data) {  
                if (data.id) {
                    redirectBack(data.id); // If batch is still available, proceed to capture.
                } else {            
                    getNewBatch(); // If batch is already asigned to a different user, get another.        
                } 
            });            
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

function recordEditor() {

    var params = {};
    params.batch_id = $('#batch_id').val();
    params.task_id = $('#session_task_id').val();
    
    $.post('../edits/recordeditor/', params);    
}