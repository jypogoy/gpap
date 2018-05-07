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
            $(dropDownEl).dropdown('set selected', value);
        } 
    }               

    // Important: Hide currency selection when in Other and show the input box.
    if (key.indexOf('currency') != -1 && value == 34) { // Other        
        $('#other_currency_wrapper').removeClass('hidden');
        $('#currency_id_wrapper').addClass('hidden');
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

    // Toggle image link buttons.
    if ($('#image_id').val() != '' || $('#image_id').val() > 0) {
        $('.link-slip-btn').addClass('hidden');
        $('.unlink-slip-btn').removeClass('hidden');      
    } else {        
        $('.link-slip-btn').removeClass('hidden');
        $('.unlink-slip-btn').addClass('hidden');          
    }

    if (key.indexOf('merchant_number') != -1) {
        getMerchantInfo($('#' + key).val()); // See de_data_retrieval.js
        padZero($('#' + key));
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
    } else {
        $('#other_fields_div').addClass('hidden');
        $('.airline-field').parent().addClass('hidden');
        $('.vi-field').parent().addClass('hidden');
    }

    // Auth Code option in Credut and Airline Credit
    if (option.indexOf('Credit') != -1) {
        $('#authorization_code_wrapper').removeClass('required');
    } else {
        var pullReasonId = $('#slip_pull_reason_id_dropdown').dropdown('get value');
        if (!pullReasonId) $('#authorization_code_wrapper').addClass('required');
    }
}

function calculateAmount() {
    var totalAmount = 0;
    slipMap.forEach(function(valueMap, page) {
        valueMap.forEach(function(value, fieldId) {
            if (fieldId.indexOf('amount') != -1 && value && value != '0') {
                value = unformatValue(value); // See utils.js
                totalAmount = Number(totalAmount ) + Number(parseFloat(value).toFixed(2));
            }
        });
    });
       
    var fAmount = accounting.formatMoney(totalAmount, { symbol: '',  format: '%v %s' }); // See accounting.min.js     
    var depAmount = unformatValue($('#deposit_amount').val()); // See utils.js    
    
    var totalAmountField = $('#total_transaction_amount');
    var varianceField =  $('#variance');
    if (currNoDecimal) {
        totalAmountField.val(accounting.formatNumber(fAmount));   
        varianceField.val(accounting.formatNumber(totalAmount - depAmount)); // See accounting.min.js            
    } else {
        totalAmountField.val(accounting.formatMoney(depAmount, { symbol: '',  format: '%v %s' }));   
        varianceField.val(accounting.formatMoney(totalAmount - depAmount, { symbol: '',  format: '%v %s' })); // See accounting.min.js
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