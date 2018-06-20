function saveSlip() {    
    var slipValueMap = new HashMap();
    var slipFields = $('.slip-field');    
    $.each(slipFields, function(i, field) {
        if($(field).is(':checkbox')) {
           slipValueMap.set(field.id, $(field).prop('checked'));
        } else {
           slipValueMap.set(field.id, field.value);
        }
        if($(field).is('span')) { // Capture labels
            slipValueMap.set(field.id, $(field).html());
        }        
    });        
    slipMap.set(slipPage, slipValueMap);
}

function navigate(direction) {

    if (Form.validate(false)) {

        // Remove any shown error messages.
        $('#transactionDataForm').find("div[id*='alert']").remove();

        saveSlip(); // Make sure to save the current slip.

        if (direction == 'next') {
            if (slipPage < slipMap.count()) slipPage++;      
            if (slipPage == slipMap.count()) {
                $('.next-slip-btn').addClass('disabled'); 
                $('.last-slip-btn').addClass('disabled'); 
                $('.insert-slip-btn').removeClass('disabled'); 
            }
        } else if (direction == 'prev') {
            if (slipPage > 1) slipPage--;
            if (slipPage == 1) {
                $('.first-slip-btn').addClass('disabled');
                $('.prev-slip-btn').addClass('disabled');
                $('.insert-slip-btn').addClass('disabled'); 
            }    
        } else if (direction == 'first') {
            slipPage = 1;    
            $('.first-slip-btn').addClass('disabled');
            $('.prev-slip-btn').addClass('disabled');    
            $('.insert-slip-btn').addClass('disabled');           
        } else if (direction == 'last') {
            slipPage = slipMap.count();
            $('.next-slip-btn').addClass('disabled'); 
            $('.last-slip-btn').addClass('disabled'); 
            $('.insert-slip-btn').removeClass('disabled'); 
        }

        var slipValueMap = slipMap.get(slipPage);
        if (slipValueMap) {
            fillFields(slipValueMap);
            $('.delete-slip-btn').removeClass('disabled');
        } else {
            Form.clear(false);
            $('.delete-slip-btn').addClass('disabled');
        }    
        
        $('#currentSlipPage').html(slipPage);      
        refreshTransTypeDependentFields(); 
        
        if (direction == 'next' || direction == 'last') {
            $('.first-slip-btn').removeClass('disabled');  
            $('.prev-slip-btn').removeClass('disabled');   
            $('.insert-slip-btn').removeClass('disabled'); 
        } else if (direction == 'prev' || direction == 'first') {
            $('.next-slip-btn').removeClass('disabled');
            $('.last-slip-btn').removeClass('disabled');
        }                
    }
}

function fillFields(map) {
    map.forEach(function(value, key) {     
        setFieldValue(key, value);                 
    });
}

function setFieldValue(key, value) {    
    // Set inline labels.
    if($('#' + key).is('span')) {
        $('#' + key).html(value);
    }
    // Set value for checkboxes and input elements.    
    if($('#' + key).is(':checkbox')) {
        if (value == true) {
            $('#' + key).prop('checked', true);
        } else {
            $('#' + key).prop('checked', false);
        }
    } else {        
        
        // For Edits only: keep a reference to the original DCN to exempt and avoid conflict during validation. See de_form_events.js for implementation.
        if (key.indexOf('dcn') != -1) origDCN = value;

        $('#' + key).val(value);
        var calEl = $('#' + key + '_cal');
        if (calEl) { // If calendar element exists
            $(calEl).calendar('set date', value);
        }
    }           
    // Set value for dropdown or comboboxes.  
    var dropDownEl = $('#' + key + '_dropdown');
    if (dropDownEl.length > 0) {
        if (value == '') {
            $(dropDownEl).dropdown('restore defaults');
        } else {       
            if (key == 'currency_id') {
                $(dropDownEl).find('.menu').empty();
                getRegionCurrency().then(function() { // See de_data_retrieval.js
                    $(dropDownEl).dropdown('set selected', value);                                        
                    
                    // Validate if currency is accepted by the merchant.
                    $('#currency_id_wrapper').removeClass('error');
                    $('#currency_id_alert').remove();
                    var currency = $('#currency_id_dropdown').dropdown('get text').split(' ')[0];
                    if (currency != merchantInfoMap.get('currency')) {
                        if (merchantInfoMap.get('acceptOtherCurrency') == 'N') {                
                            $('#currency_id_wrapper').addClass('error');
                            $('#currency_id_wrapper').append('<div class="ui basic red pointing prompt label transition" id="currency_id_alert">' +
                                    '<span id="currency_id_msg">Currency is not accepted by the merchant</span>' +
                                    '</div>');
                        }
                    } else {
                        $('#currency_id_wrapper').removeClass('error');
                        $('#currency_id_alert').remove();
                    }
                });                          
                
                // FOR VERIFY: Load the free text currency code if Other option is used. Other option is null from currencyMap by default.     
                if ($('#session_task_name').val().indexOf('Verify') != -1 && (!currencyMap.get(value) && rawHeaderMap.get('other_currency').length > 0)) {
                    $('#other_currency').val(rawHeaderMap.get('other_currency').toUpperCase());
                }      

            } else {
                $(dropDownEl).dropdown('set selected', value);
                
                // FOR VERIFY: Load the free text installment months if Other option is used. 
                if ($('#session_task_name').val().indexOf('Verify') != -1 && key == 'installment_months_id') {
                    var rawValue = rawSlipMap.get(slipPage).get(key); // See de_data_retrieval.js for map object   
                    if (rawValue) { 
                        var data = installMonthsMap.get(rawValue);  
                        if (data.on_display.indexOf('Other') != -1) {
                            $('#other_inst_term').val(rawSlipMap.get(slipPage).get('other_inst_term'));
                        }
                    }
                }            
            }                        
        } 
    }               

    // Important: Hide currency selection when in Other and show the input box.
    if (key.indexOf('currency') != -1 && value == 34) { // Other        
        $('#other_currency_wrapper').removeClass('hidden');
        $('#currency_id_wrapper').addClass('hidden');
    }

    // Important: Hide IPP Term selection when in Other and show the input box.
    if (key.indexOf('installment') != -1 && value == 60) { // Other        
        $('#other_inst_term_wrapper').removeClass('hidden');
        $('#installment_months_id_wrapper').addClass('hidden');
    }

    // Enable or disable input forms depending on pull reason.
    if (key == 'batch_pull_reason_id') {
        overrideHeader(value); // See de.js
    }  
    if (key == 'slip_pull_reason_id') {
        overrideSlip(value); // See de.js
    }    
    if (key == 'exception_id') {
        if (value && value > 0) {
            $('#other_exception_detail_wrapper').removeClass('hidden');
        } else {
            $('#other_exception_detail_wrapper').addClass('hidden');
        }       
    }    

    // Apply character count for CRI and MON.
    if (key == 'customer_reference_identifier' || key == 'merchant_order_number') {
        var valueEL = $('#' + key);
        charsLeft(valueEL[0], valueEL.attr('allowedLength'));
    }

    // Toggle image link buttons.
    if ($('#image_id').val() != '' || $('#image_id').val() > 0) {
        $('.link-slip-btn').addClass('hidden');
        $('.unlink-slip-btn').removeClass('hidden');      
    } else {        
        $('.link-slip-btn').removeClass('hidden');
        $('.unlink-slip-btn').addClass('hidden');          
    }

    if (key.indexOf('merchant_number') != -1) {        
        if ($('#' + key).val().trim().length > 0) {
            getMerchantInfo($('#' + key).val()); // See de_data_retrieval.js
            padZero($('#' + key));
        }
    }
}

function refreshTransTypeDependentFields() {
    
    //var option = $('#transaction_type_id_dropdown').dropdown('get text');
    var option = $('#transaction_type_type').val();
    if (option.indexOf('Airline') != -1) {
        $('#other_fields_div').removeClass('hidden');
        $('.airline-field').parent().removeClass('hidden');
        $('.vi-field').parent().addClass('hidden');

        $('#airline_ticket_number').keyup(function() {
            this.value = this.value.replace(/[\s]/g, '');        
        });  
    } else if (option.indexOf('VI') != -1) { 
        $('#other_fields_div').removeClass('hidden');
        $('.vi-field').parent().removeClass('hidden');
        $('.airline-field').parent().addClass('hidden');
        // Hide MON and Commodity Code fields for VI with Mastercard. See util.js
        if (getCardType(unformatValue($('#card_number').val())) == 'Mastercard') {
            $('#merchant_order_number_wrapper').addClass('hidden');
            $('#commodity_code_wrapper').addClass('hidden');
        }
    } else {
        $('#other_fields_div').addClass('hidden');
        $('.airline-field').parent().addClass('hidden');
        $('.vi-field').parent().addClass('hidden');
    }

    // Auth Code option in Credit and Airline Credit
    if (option.indexOf('Airline') != -1 || option.indexOf('Credit') != -1) {
        //$('#authorization_code_wrapper').removeClass('required');
        $('#authorization_code_wrapper').addClass('hidden');
    } else {
        var pullReasonId = $('#slip_pull_reason_id_dropdown').dropdown('get value');
        if (!pullReasonId) $('#authorization_code_wrapper').addClass('required');
        $('#authorization_code_wrapper').removeClass('hidden');
    }
}

// function calculateAmount() {
//     var text = $('#currency_id_dropdown').dropdown('get text');   

//     var totalAmount = 0;
//     slipMap.forEach(function(valueMap, page) {
//         valueMap.forEach(function(value, fieldId) {
//             if (fieldId.indexOf('amount') != -1 && value && value != '0') {
//                 value = unformatValue(value); // See utils.js
//                 //totalAmount = Number(totalAmount ) + Number(parseFloat(value).toFixed(2));
//                 totalAmount = Number(totalAmount ) + Number(value);
//             }
//         });
//     });
       
//     var fAmount = accounting.formatMoney(totalAmount, { symbol: '',  format: '%v %s' }); // See accounting.min.js     
//     var depAmount = unformatValue($('#deposit_amount').val()); // See utils.js    
//     var variance = totalAmount - depAmount;

//     var totalAmountField = $('#total_transaction_amount');
//     var varianceField =  $('#variance');    

//     if (text.indexOf('Other') != -1) {
//         var otherCurrCode = $('#other_currency').val().toUpperCase();
//         if (otherCurrCode.indexOf('JPY') != -1 || otherCurrCode.indexOf('KRW') != -1 || otherCurrCode.indexOf('IDR') != -1 
//             || ($('#region_code').val() == 'MY' && otherCurrCode.indexOf('TWD') != -1)) {
//             currNoDecimal = true;                
//         } else {
//             currNoDecimal = false;
//         }            
//     } else {
//         if (text.indexOf('JPY') != -1 || text.indexOf('KRW') != -1 || text.indexOf('IDR') != -1 
//             || ($('#region_code').val() == 'MY' && text.indexOf('TWD') != -1)) {
//             currNoDecimal = true;                
//         } else {
//             currNoDecimal = false;
//         }
//     }

//     if (currNoDecimal) {        
//         // // Format the total amount.
//         // var wholeValue = totalAmount.indexOf('.') != -1 ? totalAmount.substring(0, totalAmount.indexOf('.')) : totalAmount; // Remove the decimal value
//         // var noDecVal = noDecimal(wholeValue); // See utils.js
//         // totalAmountField.val(accounting.formatNumber(noDecVal)); // See accounting.min.js  
//         // // Format the variance amount.
//         // wholeValue = variance.indexOf('.') != -1 ? variance.substring(0, variance.indexOf('.')) : variance; // Remove the decimal value
//         // noDecVal = noDecimal(wholeValue); // See utils.js   
//         // varianceField.val(accounting.formatNumber(noDecVal)); // See accounting.min.js        
//         totalAmountField.val(totalAmount); // See accounting.min.js      
//         varianceField.val(variance); // See accounting.min.js  
//     } else {
//         if (text.indexOf('Other') != -1) {
//             var otherCurrCode = $('#other_currency').val().toUpperCase();
//             if (otherCurrCode.indexOf('BHD') != -1 || otherCurrCode.indexOf('KWD') != -1 || otherCurrCode.indexOf('OMR') != -1) {
//                 totalAmountField.val(accounting.formatMoney(totalAmount, { symbol: '', precision: 3, format: '%v %s' }));
//                 varianceField.val(accounting.formatMoney(variance, { symbol: '', precision: 3, format: '%v %s' }));
//             } else {
//                 totalAmountField.val(accounting.formatMoney(totalAmount , { symbol: '', format: '%v %s' }));
//                 varianceField.val(accounting.formatMoney(variance, { symbol: '', format: '%v %s' }));
//             }
//         } else {
//             if (text.indexOf('BHD') != -1 || text.indexOf('KWD') != -1 || text.indexOf('OMR') != -1) {
//                 totalAmountField.val(accounting.formatMoney(totalAmount, { symbol: '', precision: 3, format: '%v %s' }));
//                 varianceField.val(accounting.formatMoney(variance, { symbol: '', precision: 3, format: '%v %s' }));
//             } else {
//                 totalAmountField.val(accounting.formatMoney(totalAmount, { symbol: '', format: '%v %s' }));
//                 varianceField.val(accounting.formatMoney(variance, { symbol: '', format: '%v %s' }));
//             }
//         }
//     }
// }

// function calculateAmount_OLD() {
//     var totalAmount = 0;
//     slipMap.forEach(function(valueMap, page) {
//         valueMap.forEach(function(value, fieldId) {
//             if (fieldId.indexOf('amount') != -1 && value && value != '0') {
//                 value = unformatValue(value); // See utils.js
//                 totalAmount = Number(totalAmount ) + Number(parseFloat(value).toFixed(2));
//             }
//         });
//     });
       
//     var fAmount = accounting.formatMoney(totalAmount, { symbol: '',  format: '%v %s' }); // See accounting.min.js     
//     var depAmount = unformatValue($('#deposit_amount').val()); // See utils.js    
    
//     var totalAmountField = $('#total_transaction_amount');
//     var varianceField =  $('#variance');
//     if (currNoDecimal) {
//         totalAmountField.val(accounting.formatNumber(fAmount));   
//         varianceField.val(accounting.formatNumber(totalAmount - depAmount)); // See accounting.min.js            
//     } else {
//         totalAmountField.val(accounting.formatMoney(totalAmount, { symbol: '',  format: '%v %s' }));   
//         varianceField.val(accounting.formatMoney(totalAmount - depAmount, { symbol: '',  format: '%v %s' })); // See accounting.min.js
//     }
// }

function setAsException(batchId, isException) {
    var params = {};
    params.batch_id = batchId;
    params.is_exception = isException;
    $.post('../batch/exception/', params, function (success) {
        if (isException) {
            $('#variance_exception_wrapper').removeClass('error');
            $('#variance_alert').remove();
        }
    });    
}