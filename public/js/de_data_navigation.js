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
            //$('#commodity_code_wrapper').addClass('hidden');
        }
    } else {
        $('#other_fields_div').addClass('hidden');
        $('.airline-field').parent().addClass('hidden');
        $('.vi-field').parent().addClass('hidden');
    }

    // Auth Code option in Credit and Airline Credit
    if (option.indexOf('Airline') != -1 || option.indexOf('Credit') != -1) {
        $('#authorization_code_wrapper').addClass('hidden');
    } else {
        var pullReasonId = $('#slip_pull_reason_id_dropdown').dropdown('get value');
        if (!pullReasonId) $('#authorization_code_wrapper').addClass('required');
        $('#authorization_code_wrapper').removeClass('hidden');
    }
}

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