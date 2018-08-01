var headerFields;
var slipFields;

$(function() {

    if ($('#session_task_name').val().indexOf('Verify') != -1) {
        headerFields = $('.header-field');
        slipFields = $('.slip-field');                        
    }

});

function applyHeaderChecks(fields) {
    $.each(headerFields, function(i, field) {                      
        // Input fields
        $(field).blur(function(e) {                
            $('#' + field.id + '_alert').remove();
            var rawValue = rawHeaderMap.get(field.id); // See de_data_retrieval.js for map object         
            if (field.id.indexOf('date') != -1) {
                if (rawValue && rawValue.length > 0) {
                    var date =new Date(rawValue);                        
                    rawValue = formatDate(date); // See util.js
                    if(field.value !== rawValue) {                                                    
                        showMessage(field.id, rawValue, rawValue);
                    }
                }
            } else {
                if (field.id.indexOf('other_currency') != -1) {
                    if(rawValue && field.value.trim().toUpperCase() != rawValue.trim().toUpperCase()) {                                                    
                        showMessage(field.id, rawValue, rawValue, true);
                    }
                } else {
                    if(rawValue && field.value.trim() != rawValue.trim()) {                                                    
                        showMessage(field.id, rawValue, rawValue);
                    }
                }
            }
        });

        // Dropdown or comboboxes
        var dropdown = $('#' + field.id + '_dropdown');
        $(dropdown).find('.search').blur(function(e) {
            $('#' + field.id + '_alert').remove();
            var rawValue = rawHeaderMap.get(field.id); // See de_data_retrieval.js for map object    
            if ($(dropdown).dropdown('get value') !== rawValue) {   
                if (field.id == 'currency_id') {    
                    var data = currencyMap.get(rawValue);
                    // If existing currency is selected.              
                    if (data) showMessage(field.id, rawValue, data.alpha_code);
                    // If Other option is used.
                    if (!data && rawHeaderMap.get('other_currency').length > 0) showMessage(field.id, rawValue, rawHeaderMap.get('other_currency').toUpperCase(), true, true);
                } else if (field.id == 'batch_pull_reason_id') {
                    var data = batchPullReasonMap.get(rawValue);   
                    if (data) showMessage(field.id, data.id, data.on_display);
                }
            }
        });
        $(dropdown).change(function(e) {
            $('#' + field.id + '_alert').remove();
            var rawValue = rawHeaderMap.get(field.id); // See de_data_retrieval.js for map object    
            if ($(dropdown).dropdown('get value') !== rawValue) {                    
                if (field.id == 'currency_id') {    
                    var data = currencyMap.get(rawValue);                    
                    if (data) showMessage(field.id, rawValue, data.alpha_code);
                } else if (field.id == 'batch_pull_reason_id') {
                    var data = batchPullReasonMap.get(rawValue);   
                    if (data) showMessage(field.id, data.id, data.on_display);
                }
            }
        });
    });
}

function applySlipChecks() {
    if (rawSlipMap.count() > 0) {
        $.each(slipFields, function(i, field) {                      
            // Input fields
            $(field).blur(function(e) {                
                $('#' + field.id + '_alert.mismatch-prompt').remove();
                if (rawSlipMap.get(slipPage)) {
                    var rawValue = rawSlipMap.get(slipPage).get(field.id); // See de_data_retrieval.js for map object         
                    if (field.id.indexOf('date') != -1) {
                        if (rawValue && rawValue.length > 0) {
                            var date =new Date(rawValue);                        
                            rawValue = formatDate(date); // See util.js
                            if(field.value !== rawValue) {                                                    
                                showMessage(field.id, rawValue, rawValue);
                            }
                        }
                    } else {
                        if (field.id == 'card_number') {
                            field.value = cc_format(field.value); // See util.js                            
                        }
                        if (field.id == 'transaction_amount') {
                            if (rawValue) rawValue = rawValue.trim();
                            field.value = field.value.trim();
                        }
                        if(rawValue && field.value !== rawValue) {         
                            showMessage(field.id, rawValue, rawValue);
                        } else {
                            //hideMessage(field.id);
                        }
                    }
                }
            });
            // Dropdown or comboboxes
            var dropdown = $('#' + field.id + '_dropdown');
            $(dropdown).find('.search').blur(function(e) {
                $('#' + field.id + '_alert').remove();
                if (rawSlipMap.get(slipPage)) {
                    var rawValue = rawSlipMap.get(slipPage).get(field.id); // See de_data_retrieval.js for map object    
                    if (rawValue && $(dropdown).dropdown('get value') !== rawValue) {                    
                        if (field.id == 'installment_months_id') {    
                            var data = installMonthsMap.get(rawValue);    
                            if (data) showMessage(field.id, rawValue, data.on_display + (data.on_display.indexOf('Other') != -1 ? ':' + rawSlipMap.get(slipPage).get('other_inst_term') : ''));
                        } else if (field.id == 'slip_pull_reason_id') {
                            var data = slipPullReasonMap.get(rawValue);   
                            if (data) showMessage(field.id, data.id, data.on_display);
                        } else if (field.id == 'exception_id') {
                            var data = exceptionMap.get(rawValue);   
                            if (data) showMessage(field.id, data.id, data.title);
                        }
                    } else {
                        $('#' + field.id + '_wrapper').removeClass('error');
                    }
                }
            });
            $(dropdown).change(function(e) {
                $('#' + field.id + '_alert').remove();
                if (rawSlipMap.get(slipPage)) {
                    var rawValue = rawSlipMap.get(slipPage).get(field.id); // See de_data_retrieval.js for map object    
                    if (rawValue && $(dropdown).dropdown('get value') !== rawValue) {                    
                        if (field.id == 'installment_months_id') {    
                            var data = installMonthsMap.get(rawValue);                    
                            if (data) showMessage(field.id, rawValue, data.on_display);
                        } else if (field.id == 'slip_pull_reason_id') {
                            var data = slipPullReasonMap.get(rawValue);   
                            if (data) showMessage(field.id, data.id, data.on_display);
                        } else if (field.id == 'exception_id') {
                            var data = exceptionMap.get(rawValue);   
                            if (data) showMessage(field.id, data.id, data.title);
                        }
                    } else {
                        $('#' + field.id + '_wrapper').removeClass('error');
                    }
                }
            });
        });
    }
}

function showMessage(fieldId, value, msg, msgToUpper, showOtherLabel) {
    var wrapper = $('#' + fieldId + '_wrapper');
    $(wrapper).addClass('error');
    wrapper.append('<div class="ui basic red pointing prompt label transition mismatch-prompt" id="' + fieldId + '_alert">' +
                    '<span id="' + fieldId + '_msg">E1= ' + (showOtherLabel ? 'Other:' : '') + (msgToUpper ? msg.toUpperCase() : msg) + '   <a onclick="acceptRaw(\'' + fieldId + '\',\'' + value + '\');">Accept</a></span>' +
                    '</div>');
}

function acceptRaw(fieldId, value) {
    setFieldValue(fieldId, value) // See de_data_navigation.js   
    $('#' + fieldId).focus();
    hideMessage(fieldId);
    if (fieldId.indexOf('image') != -1) {
        var rawId = rawSlipMap.get(slipPage).get('image_id'); // See de_data_retrieval.js for map object  
        $('#image_id').val(rawId);
    } 
    if (fieldId == 'merchant_number') getRegionCurrency(); // See de_data_retrieval.js    
    if (fieldId == 'card_number' || fieldId == 'transaction_date') {
        $('#' + fieldId).trigger('blur');
        $('#' + fieldId).focus();
    }
}

function hideMessage(fieldId) {    
    $('#' + fieldId + '_alert').remove();    
    $('#' + fieldId + '_wrapper').removeClass('error');    
}