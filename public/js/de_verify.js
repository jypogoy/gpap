var headerFields;
var slipFields;

$(function() {

    if ($('#session_task_name').val().indexOf('Verify') != -1) {
        headerFields = $('.header-field');
        slipFields = $('.slip-field');    
        applyHeaderChecks();    
        applySlipChecks();
    }

});

function applySlipChecks() {
    if (rawSlipMap.count() > 0) {
        $.each(slipFields, function(i, field) {                      
            // Input fields
            $(field).blur(function(e) {                
                $('#' + field.id + '_alert').remove();
                var rawValue = rawSlipMap.get(slipPage).get(field.id); // See de_data_retrieval.js for map object         
                if (field.id.indexOf('date') != -1) {
                    var date =new Date(rawValue);                        
                    rawValue = formatDate(date); // See util.js
                    if(rawValue && field.value !== rawValue) {                                                    
                        showMessage(field.id, rawValue, rawValue);
                    }
                } else {
                    if(rawValue && field.value !== rawValue) {                                                    
                        showMessage(field.id, rawValue, rawValue);
                    }
                }
            });
            // Dropdown or comboboxes
            var dropdown = $('#' + field.id + '_dropdown');
            $(dropdown).blur(function(e) {
                $('#' + field.id + '_alert').remove();
                var rawValue = rawSlipMap.get(slipPage).get(field.id); // See de_data_retrieval.js for map object    
                if (rawValue && $(dropdown).dropdown('get value') !== rawValue) {                    
                    if (field.id == 'installment_months_id') {    
                        var data = installMonthsMap.get(rawValue);                    
                        if (data) showMessage(field.id, rawValue, data.title);
                    } else if (field.id == 'slip_pull_reason_id') {
                        var data = slipPullReasonMap.get(rawValue);   
                        if (data) showMessage(field.id, data.id, data.title + '-' + data.reason);
                    } else if (field.id == 'exception_id') {
                        var data = exceptionMap.get(rawValue);   
                        if (data) showMessage(field.id, data.id, data.title);
                    }
                }
            });
        });
    }
}

function applyHeaderChecks(fields) {
    $.each(headerFields, function(i, field) {                      
        // Input fields
        $(field).blur(function(e) {                
            $('#' + field.id + '_alert').remove();
            var rawValue = rawHeaderMap.get(field.id); // See de_data_retrieval.js for map object         
            if (field.id.indexOf('date') != -1) {
                var date =new Date(rawValue);                        
                rawValue = formatDate(date); // See util.js
                if(rawValue && field.value !== rawValue) {                                                    
                    showMessage(field.id, rawValue, rawValue);
                }
            } else {
                if(rawValue && field.value !== rawValue) {                                                    
                    showMessage(field.id, rawValue, rawValue);
                }
            }
        });
        // Dropdown or comboboxes
        var dropdown = $('#' + field.id + '_dropdown');
        $(dropdown).blur(function(e) {
            $('#' + field.id + '_alert').remove();
            var rawValue = rawHeaderMap.get(field.id); // See de_data_retrieval.js for map object    
            if ($(dropdown).dropdown('get value') !== rawValue) {                    
                if (field.id == 'currency_id') {    
                    var data = currencyMap.get(rawValue);                    
                    if (data) showMessage(field.id, rawValue, data.alpha_code);
                } else if (field.id == 'batch_pull_reason_id') {
                    var data = batchPullReasonMap.get(rawValue);   
                    if (data) showMessage(field.id, data.id, data.title + '-' + data.reason);
                }
            }
        });
    });
}

function showMessage(fieldId, value, msg) {
    var wrapper = $('#' + fieldId + '_wrapper');
    $(wrapper).addClass('error');
    wrapper.append('<div class="ui basic red pointing prompt label transition" id="' + fieldId + '_alert">' +
                    '<span id="' + fieldId + '_msg">E1= ' + msg + '   <a onclick="acceptRaw(\'' + fieldId + '\',\'' + value + '\');">Accept</a></span>' +
                    '</div>');
}

function acceptRaw(fieldId, value) {
    setFieldValue(fieldId, value) // See de_data_navigation.js
    $('#' + fieldId + '_alert').remove();
    $('#' + fieldId + '_wrapper').removeClass('error');
    $('#' + fieldId).focus();
}