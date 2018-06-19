$(function() {
    $('form').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
            e.preventDefault();
            return false;
        }
    });

    //------------- Header Events ---------------------------------    
    $('#merchant_number').on('keyup', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13 && $(this).val().length > 0) { 
            getMerchantInfo($(this).val()).then(function(data) { // See de_data_retrieval.js
                if (!data) {
                    $('#merchant_number').focus();
                } else {
                    getRegionCurrency(); // See de_data_retrieval.js
                    $('#currency_id_dropdown').find('.search').focus();
                }
            }); 
            if ($(this).val().trim().length > 0) padZero($(this)); // Pad only if there is a specified Merchant Number.
            $('#card_number_alert').remove();
            $('#card_number_wrapper').removeClass('error');            
        }
        this.value = this.value.replace(/[^0-9]/, '');
    });
    
    $('#merchant_number').blur(function() {
        if (this.value != '') $('#merchant_number_wrapper').removeClass('error');                    
    });

    $('#currency_id_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');    
            if (value == 34) { // Other
                $(this).addClass('hidden');
                $('#other_currency_wrapper').removeClass('hidden');
                $('#currency_id_wrapper').addClass('hidden');
                $('#other_currency').focus();
                
                // Show tip if allows multiple currencies.
                if (merchantInfoMap.get('acceptOtherCurrency') == 'Y') {
                    $('#other_multi_currency').html(' MULTI');
                } else {
                    $('#other_multi_currency').html('');
                }
            } else {
                $('#other_currency_wrapper').addClass('hidden');
                $('#currency_id_wrapper').removeClass('hidden');
                if (value > 0) {
                    if (this.value != '') {
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
                    }
                } else {
                    $(this).dropdown('restore defaults');
                    $('#currency_id_wrapper').removeClass('error');
                    $('#currency_id_alert').remove();
                }
            }

            loadAndFormatAmounts();
        }
    });    

    $('#other_currency').keyup(function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 27) { 
            $('#other_currency').val('');
            $('#other_currency_wrapper').addClass('hidden');
            $('#currency_id_wrapper').removeClass('hidden');
            $('#currency_id_dropdown').removeClass('hidden');
            $('#currency_id_dropdown').dropdown('restore defaults');
            $('#currency_id_dropdown').find('.search').focus();

            loadAndFormatAmounts();
        }
    });

    $('#other_currency').blur(function(e) {
        var el = this;
        var otherCurrencyCode = el.value;
        $.post('../currency/getbyalphacode/' + otherCurrencyCode, function (currency) {
            if (currency) {
                loadAndFormatAmounts();
                $('#deposit_amount').focus();
            } else {                
                toastr.info('Currency with code <b>' + otherCurrencyCode.toUpperCase() + '</b> does note exist!');
                $(el).focus();
                $(el).select();
                return;
            }
        });        
    });

    $('#currency_id_dropdown').find('.search').blur(function() {
        $('#currency_id_wrapper').removeClass('error');
        $('#currency_id_alert').remove();
        var currency = $('#currency_id_dropdown').dropdown('get text').split(' ')[0];
        if ($('#merchant_number').val() != '') {
            if (currency != 'Choose' && currency != merchantInfoMap.get('currency')) {
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
        } else {
            //$('#merchant_number').focus(); !Editted for No MID handle
            $('#currency_id_wrapper').removeClass('error');
            $('#currency_id_alert').remove();
        }
    });

    $('#otherCurrencyBtn').click(function(e) {
        e.preventDefault();
        $('#other_currency').val('');
        $('#other_currency_wrapper').addClass('hidden');        
        $('#currency_id_wrapper').removeClass('hidden');
        $('#currency_id_dropdown').removeClass('hidden');
        $('#currency_id_dropdown').dropdown('restore defaults');
        $('#currency_id_dropdown').find('.search').focus();
        
        loadAndFormatAmounts();
    });

    $('#dcn').focusin(function() {
        $('#' + this.id + '_wrapper').removeClass('error');
        $('#' + this.id + '_alert').remove();    
        $('#' + this.id + '_wrapper').removeClass('error');
        $('#' + this.id + '_alert').remove();    
    });

    $('#dcn').blur(function() {
        var el = this;
        this.value = this.value.toUpperCase();
        var wrapper = $('#' + el.id + '_wrapper');       
        if (this.value.length > 0) {
            if (this.value.length < 7) {
                $(wrapper).removeClass('error');
                $('#' + el.id + '_alert').remove();
                $(wrapper).addClass('error');
                $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + el.id + '_alert">' +
                        '<span id="' + el.id + '_msg">Must be 7 chars long</span>' +
                        '</div>');
            } else {       
                $(wrapper).removeClass('error');
                $('#' + el.id + '_alert').remove();                    
                if ($('#session_from_edits').val() > 0 && this.value != origDCN) { // For Edits only: validate other DCNs as the current value will be treated as valid.
                    var params = {};
                    params.batch_id = $('#batch_id').val();
                    params.task_id = $('#session_task_id').val();
                    params.dcn = $('#dcn').val();
                    params.region_code = $('#region_code').val();

                    // Same DCN within the same Region on the same day
                    $.post('../dcn/getsameregionday/', params, function (data) {   
                        if (data) {
                            //$('#' + this.id + '_alert').remove();
                            $(wrapper).addClass('error');
                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + el.id + '_alert">' +
                                    '<span id="' + el.id + '_msg">Exists in ' + data.image_path + ': Same DCN within the same Region on the same day</span>' +
                                    '</div>');                                 
                        } else {
                            // $(wrapper).removeClass('error');
                            // $('#' + el.id + '_alert').remove();
                        }
                    });

                    var params = {};
                    params.batch_id = $('#batch_id').val();
                    params.task_id = $('#session_task_id').val();
                    params.dcn = $('#dcn').val();
                    params.merchant_number = $('#merchant_number').val();                
                    params.deposit_amount =  $('#deposit_amount').val().trim();
                    params.region_code = $('#region_code').val();    
                    // Same DCN, same MID, same total amount within the same Region in the historical record
                    $.post('../dcn/getsamemidamountregion/', params, function (data) {      
                        if (data) {
                            //$('#' + el.id + '_alert').remove();
                            $(wrapper).addClass('error');
                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + el.id + '_alert">' +
                                    '<span id="' + el.id + '_msg">Exists in ' + data.image_path + ': Same DCN, MID, Total Amount within the same Region in the historical record</span>' +
                                    '</div>');                                 
                        } else {
                            // $(wrapper).removeClass('error');
                            // $('#' + el.id + '_alert').remove();
                        }
                    });               
                } else { // Other than Edits
                    var params = {};
                    params.batch_id = $('#batch_id').val();
                    params.task_id = $('#session_task_id').val();
                    params.dcn = $('#dcn').val();
                    params.region_code = $('#region_code').val();

                    // Same DCN within the same Region on the same day
                    $.post('../dcn/getsameregionday/', params, function (data) {   
                        if (data) {
                            //$('#' + this.id + '_alert').remove();
                            $(wrapper).addClass('error');
                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + el.id + '_alert">' +
                                    '<span id="' + el.id + '_msg">Exists in ' + data.image_path + ': Same DCN within the same Region on the same day</span>' +
                                    '</div>');                                 
                        } else {
                            // $(wrapper).removeClass('error');
                            // $('#' + el.id + '_alert').remove();
                        }
                    });

                    var params = {};
                    params.batch_id = $('#batch_id').val();
                    params.task_id = $('#session_task_id').val();
                    params.dcn = $('#dcn').val();
                    params.merchant_number = $('#merchant_number').val();                
                    params.deposit_amount =  $('#deposit_amount').val().trim();
                    params.region_code = $('#region_code').val();    
                    // Same DCN, same MID, same total amount within the same Region in the historical record
                    $.post('../dcn/getsamemidamountregion/', params, function (data) {      
                        if (data) {
                            //$('#' + el.id + '_alert').remove();
                            $(wrapper).addClass('error');
                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + el.id + '_alert">' +
                                    '<span id="' + el.id + '_msg">Exists in ' + data.image_path + ': Same DCN, MID, Total Amount within the same Region in the historical record</span>' +
                                    '</div>');                                 
                        } else {
                            // $(wrapper).removeClass('error');
                            // $('#' + el.id + '_alert').remove();
                        }
                    });               
                }                          
            }    
        } else {
            $(wrapper).removeClass('error');
            $('#' + this.id + '_alert').remove();   
        }
    });   

    $('#dcn').keyup(function() {
        toAlphaNumNoSpace(this);
    });
    
    $('#deposit_date').blur(function() {
        if (this.value != '') $('#deposit_date_wrapper').removeClass('error');
    });  
    
    $('#deposit_amount').blur(function() {
        // if (currNoDecimal) {
        //     var noDecVal = noDecimal(this.value); // See utils.js
        //     this.value = accounting.formatNumber(noDecVal); // See accounting.min.js            
        // } else {
        //     this.value = accounting.formatMoney(this.value, { symbol: '',  format: '%v %s' }); // See accounting.min.js
        // } 
        loadAndFormatAmounts();       
        calculateAmount(); // See de_data_navigation.js
        
        var wrapper = $('#' + this.id + '_wrapper');
        if (this.value == '' || this.value == 0 || this.value == '0.00') {
            $('#' + this.id + '_alert').remove();
            $(wrapper).addClass('error');
            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                    '<span id="' + this.id + '_msg">Invalid Amount</span>' +
                    '</div>');
        } else {
            $(wrapper).removeClass('error');
            $('#' + this.id + '_alert').remove();
        }
    });  

    $('#deposit_amount').keyup(function() {
        unformat(this); // See utils.js
    });

    $('#deposit_amount').focus(function() {
        unformat(this); // See utils.js
        this.select();
    });

    $('#batch_pull_reason_id_dropdown').find('.search').focus(function() {        
        if ($('#headerDataForm').find('.error').length == 0) {
            $('#transaction_date').focus();
        }
    });    
    //------------- Transaction Events ---------------------------------

    $('#region_code').keyup(function() {
        this.value = this.value.toUpperCase();
        this.value = this.value.replace(/[^a-zA-Z]/, '');        
    });

    $('#region_code').blur(function() {
        if (this.value != '') $('#region_code_wrapper').removeClass('error');
    });

    $('#transaction_date').blur(function() {
        var wrapper = $('#' + this.id + '_wrapper');
        var alert = $('#' + this.id + '_alert');
        var msg = $('#' + this.id + '_msg');
        if (this.value != '') {
            $(wrapper).removeClass('error');
            $(alert).remove();
            if (!moment(this.value, 'MM/DD/YY', true).isValid()) { // See moment.js
                $(wrapper).addClass('error');
                $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="transaction_date_alert">' +
                        '<span id="transaction_date_msg">Invalid Date s/b in MM/DD/YY Format</span>' +
                        '</div>');
                $(this).focus();
                $(this).select();                
            } else {
                var date = $.datepicker.formatDate('yy-mm-dd', new Date(this.value));

                $.post('../transaction/transdateelevenmonthsolder/' + date, function(data) {
                    $(wrapper).removeClass('error');
                    $(alert).remove();
                    if (data.is_older == 1) {
                        $(wrapper).addClass('error');
                        $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="transaction_date_alert">' +
                                '<span id="transaction_date_msg">Older than 11 months</span>' +
                                '</div>');
                        $(this).val('');
                        $(this).select();
                        $(this).focus();
                    }
                })
                .fail(function (xhr, status, error) {
                    toastr.error(error);
                });

                $.post('../transaction/transdatefuture/' + date, function(data) {
                    $(wrapper).removeClass('error');
                    $(alert).remove();
                    if (data.is_future == 1) {                
                        $(wrapper).addClass('error');
                        $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="transaction_date_alert">' +
                                '<span id="transaction_date_msg">Future Date</span>' +
                                '</div>');
                        $(this).val('');
                        $(this).select();
                        $(this).focus();
                    }
                })
                .fail(function (xhr, status, error) {
                    toastr.error(error);
                });
            }            
        }
    });    

    $('#card_number').blur(function() {
        var wrapper = $('#' + this.id + '_wrapper');
        var alert = $('#' + this.id + '_alert');
        var msg = $('#' + this.id + '_msg');
        var logo = $('#cardLogo');
        if ($('#merchant_number').val() == '') {
            $(alert).remove();
            $(wrapper).addClass('error');
            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                    '<span id="' + this.id + '_msg">Merchant required</span>' +
                    '</div>');
            $(this).val('');
            $('#merchant_number').focus();
        } else {
            refreshTransTypeDependentFields(); // See de_data_navigation.js

            if (this.value.length == 0) {
                $(alert).remove();
                $(wrapper).removeClass('error');
            } else {
                if (!withinCardCollection(this.value)) { // See util.js
                    $(alert).remove();
                    $(wrapper).addClass('error');
                    $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                            '<span id="' + this.id + '_msg">Invalid Starting Number</span>' +
                            '</div>');
                    isPreInvalid = true;
                } else {
                    if (this.value.length < this.maxLength) {
                        $(alert).remove();
                        $(wrapper).addClass('error');
                        $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                '<span id="' + this.id + '_msg">Invalid Length: ' + unformatValue(this.value).length + ' of ' + this.maxLength + '</span>' +
                                '</div>');
                        isPreInvalid = true;
                    } else {
                        var mod10Valid = validateCard($(this).val()); // MOD 10 check. See util.js
                        if (!mod10Valid) {

                            $(alert).remove();
                            $(wrapper).addClass('error');
                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                    '<span id="' + this.id + '_msg">Invalid PAN: MOD10 Failed</span>' +
                                    '</div>');
                            $(logo).attr('src', '../public/img/card/private.png')

                            // var isPreInvalid = false;
                            // var cardType = getCardType($(this).val()); // See util.js
                            // switch (cardType) {
                            //     case 'Maestro':
                            //         $(alert).remove();
                            //         $(wrapper).addClass('error');
                            //         $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                            //                 '<span id="' + this.id + '_msg">PAN Issuer Identification Number is not supported</span>' +
                            //                 '</div>');
                            //         $(logo).attr('src', '../public/img/card/maestro.png');
                            //         isPreInvalid = true;
                            //         break;

                            //     case 'NotSupported':
                            //         $(alert).remove();
                            //         $(wrapper).addClass('error');
                            //         $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                            //                 '<span id="' + this.id + '_msg">Invalid Starting Number</span>' +
                            //                 '</div>');
                            //         isPreInvalid = true;
                            //         break;

                            //     default:                            
                            //             break;
                            // }
                            
                            // if (!isPreInvalid) {
                            //     $(alert).remove();
                            //     $(wrapper).addClass('error');
                            //     $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                            //             '<span id="' + this.id + '_msg">Invalid Credit Card number</span>' +
                            //             '</div>');
                            //     $(logo).attr('src', '../public/img/card/private.png')
                            // }
                        } else {
                            $(wrapper).removeClass('error');       
                            $(alert).remove();
                            var cardType = getCardType($(this).val()); // See util.js
                            
                            if (this.value.trim() != '') {
                                
                                this.value = cc_format(this.value); // See util.js                                
                                
                                switch (cardType) {
                                    case 'Maestro':
                                        $(alert).remove();
                                        $(wrapper).addClass('error');
                                        $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                                '<span id="' + this.id + '_msg">PAN Issuer Identification Number is not supported</span>' +
                                                '</div>');
                                        $(logo).attr('src', '../public/img/card/maestro.png');
                                        isPreInvalid = true;
                                        break;

                                    case 'NotSupported':
                                        $(alert).remove();
                                        $(wrapper).addClass('error');
                                        $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                                '<span id="' + this.id + '_msg">Invalid Starting Number</span>' +
                                                '</div>');
                                        isPreInvalid = true;
                                        break;

                                    case 'Visa':
                                        if ($.inArray('Visa', merchantAcceptedCards) < 0) {
                                            //toastr.info('Merchant does not accept Visa.');
                                            $(alert).remove();
                                            $(wrapper).addClass('error');
                                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                                    '<span id="' + this.id + '_msg">Merchant does not accept Visa</span>' +
                                                    '</div>');
                                        }   
                                        $(logo).attr('src', '../public/img/card/visa.png')
                                        break;
                                    
                                    case 'Mastercard':
                                        if ($.inArray('Mastercard', merchantAcceptedCards) < 0) {
                                            //toastr.info('Merchant does not accept Mastercard.'); 
                                            $(alert).remove();
                                            $(wrapper).addClass('error');
                                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                                    '<span id="' + this.id + '_msg">Merchant does not accept Mastercard</span>' +
                                                    '</div>');  
                                        }
                                        $(logo).attr('src', '../public/img/card/mastercard.png')
                                        break;                                        

                                    case 'JCB':
                                        if ($.inArray('JCB', merchantAcceptedCards) < 0) {
                                            //toastr.info('Merchant does not accept JCB.');  
                                            $(alert).remove();
                                            $(wrapper).addClass('error');
                                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                                    '<span id="' + this.id + '_msg">Merchant does not accept JCB</span>' +
                                                    '</div>'); 
                                        }
                                        $(logo).attr('src', '../public/img/card/jcb.png')
                                        break;    
                                        
                                    case 'AMEX':
                                        if ($.inArray('Amex', merchantAcceptedCards) < 0) {
                                            //toastr.info('Merchant does not accept AMEX.');  
                                            $(alert).remove();
                                            $(wrapper).addClass('error');
                                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                                    '<span id="' + this.id + '_msg">Merchant does not accept AMEX</span>' +
                                                    '</div>');
                                        }
                                        $(logo).attr('src', '../public/img/card/amex.png')
                                        break;     

                                    case 'CUP':
                                        if ($.inArray('Amex', merchantAcceptedCards) < 0) {
                                            //toastr.info('Merchant does not accept CUP.');  
                                            $(alert).remove();
                                            $(wrapper).addClass('error');
                                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                                    '<span id="' + this.id + '_msg">Merchant does not accept CUP</span>' +
                                                    '</div>');
                                        }
                                        $(logo).attr('src', '../public/img/card/cup.png')
                                        break;     

                                    case 'Discover':
                                        if ($.inArray('Discover', merchantAcceptedCards) < 0) {
                                            //toastr.info('Merchant does not accept Discover.');  
                                            $(alert).remove();
                                            $(wrapper).addClass('error');
                                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                                    '<span id="' + this.id + '_msg">Merchant does not accept Discover</span>' +
                                                    '</div>');
                                        }
                                        $(logo).attr('src', '../public/img/card/discover.png')
                                        break;      
                                
                                    default:
                                        if ($.inArray('Mastercard', merchantAcceptedCards) < 0) {
                                            //toastr.info('Merchant does not accept Private Label.');  
                                            $(alert).remove();
                                            $(wrapper).addClass('error');
                                            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                                    '<span id="' + this.id + '_msg">Merchant does not accept Private Label</span>' +
                                                    '</div>');
                                        }
                                        $(logo).attr('src', '../public/img/card/private.png')
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    $('#card_number').keyup(function() {
        unformat(this); // See util.js
        limitCardLengthByStartingNumbers(this); // See util.js
    });

    $('#card_number').click(function() {
        unformat(this); // See util.js
        this.select();
    });

    $('#authorization_code').keyup(function() {
        toAlphaNumNoSpace(this);
    });

    $('#authorization_code').blur(function() {
        if (this.value != '') $('#authorization_code_wrapper').removeClass('error');
        this.value = this.value.toUpperCase();
        var wrapper = $('#' + this.id + '_wrapper');
        $(wrapper).removeClass('error');
        $('#' + this.id + '_alert').remove();
        // Check length of keyed information.
        if (this.value.length > 0 && this.value.length < this.minLength) {      
            if ($('#region_code').val() == 'HK' && this.value.length >= 2) {
                // Do nothing. Allow this value in HK only.
            } else {   
                $(wrapper).addClass('error');
                $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                        '<span id="' + this.id + '_msg">Invalid Authorization Code</span>' +
                        '</div>');
            }
        } else {
            if (slipPage > 1) { // Get the previous transaction and check if Auth Code is already used.
                var slipValueMap = slipMap.get(slipPage - 1);
                if (slipValueMap) {
                    var prevAuthCode = slipValueMap.get('authorization_code');
                    if (prevAuthCode && prevAuthCode.length > 0 && this.value.length > 0 && prevAuthCode === this.value) {
                        $(wrapper).addClass('error');
                        $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                                '<span id="' + this.id + '_msg">Auth Code with duplicate</span>' +
                                '</div>');
                    }
                }
            } else {
                $(wrapper).removeClass('error');
            }            
        }
    }); 

    $('#transaction_amount').blur(function() {
        // if (currNoDecimal) {
        //     var noDecVal = noDecimal(this.value); // See utils.js
        //     this.value = accounting.formatNumber(noDecVal); // See accounting.min.js            
        // } else {
        //     this.value = accounting.formatMoney(this.value, { symbol: '',  format: '%v %s' }); // See accounting.min.js
        // }
        loadAndFormatAmounts();
        if (this.value != '') $('#transaction_amount_wrapper').removeClass('error');
        saveSlip(); // Make sure to save the current slip to apply amount.
        calculateAmount(); // See de_data_navigation.js
    }); 

    $('#transaction_amount').keyup(function() {
        unformat(this); // See utils.js
    });

    $('#transaction_amount').focus(function() {
        unformat(this); // See utils.js
        this.select();
    });

    $('#installment_months_id_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');    
            if (value > 0) {
                if (value == 60) { // Other
                    $('#other_inst_term_wrapper').removeClass('hidden');
                    $('#installment_months_id_wrapper').addClass('hidden');
                    $('#other_inst_term').focus();
                } else {
                    $('#other_inst_term').val('');
                }
            } else {
                $(this).dropdown('restore defaults');
            }
        }
    });

    $('#other_inst_term').keyup(function() {
        toNum(this);
    });

    $('#other_inst_term').keyup(function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 27) { 
            $('#other_inst_term').val('');
            $('#other_inst_term_wrapper').addClass('hidden');
            $('#installment_months_id_wrapper').removeClass('hidden');
            $('#installment_months_id_dropdown').removeClass('hidden');
            $('#installment_months_id_dropdown').find('.search').focus();
            $('#installment_months_id_dropdown').dropdown('restore defaults');
        }
    });

    $('#otherInstBtn').click(function(e) {
        e.preventDefault();
        $('#other_inst_term').val('');
        $('#other_inst_term_wrapper').addClass('hidden');
        $('#installment_months_id_wrapper').removeClass('hidden');
        $('#installment_months_id_dropdown').removeClass('hidden');
        $('#installment_months_id_dropdown').find('.search').focus();
        $('#installment_months_id_dropdown').dropdown('restore defaults');
    });

    $('#customer_reference_identifier').keyup(function() {
        $(this).val($(this).val().toUpperCase());      
        charsLeft(this, $(this).attr('allowedLength'));
        var wrapper = $('#' + this.id + '_wrapper');
        $('#' + this.id + '_alert').remove();
        if (this.value.length > $(this).attr('allowedLength')) {                
            $(wrapper).addClass('error');
            wrapper.append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                            '<span id="' + this.id + '_msg">Exceeds 17 chars</span>' +
                            '</div>');
            return;
        } else {
            $(wrapper).removeClass('error');                
        }
    });

    $('#merchant_order_number').keyup(function() {
        $(this).val($(this).val().toUpperCase());
        charsLeft(this, $(this).attr('allowedLength'));
        var wrapper = $('#' + this.id + '_wrapper');
        $('#' + this.id + '_alert').remove();
        if (this.value.length > $(this).attr('allowedLength')) {                
            $(wrapper).addClass('error');
            wrapper.append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                            '<span id="' + this.id + '_msg">Exceeds 25 chars</span>' +
                            '</div>');
            return;
        } else {
            $(wrapper).removeClass('error');                
        }
    });

    $('#commodity_code').keyup(function() {
        $(this).val($(this).val().toUpperCase());
    });

    //TODO
    //------------- Transaction Control Events ---------------------------------
    $('.more-btn').click(function(e) {
        e.preventDefault();        
        addNewSlip();       
    });

    $('.first-slip-btn').click(function(e) {
        e.preventDefault();
        navigate('first'); // See de_data_navigation.js
    });

    $('.prev-slip-btn').click(function(e) {
        e.preventDefault();
        navigate('prev'); // See de_data_navigation.js
    });

    $('.next-slip-btn').click(function(e) {
        e.preventDefault();
        navigate('next'); // See de_data_navigation.js
    });

    $('.last-slip-btn').click(function(e) {
        e.preventDefault();
        navigate('last'); // See de_data_navigation.js
    });

    $('.insert-slip-btn').click(function(e) {
        e.preventDefault();
        insertSlip();                
    });

    $('.delete-slip-btn').click(function(e) {
        e.preventDefault();
        deleteSlip();     
    });

    $('.reset-slip-btn').click(function(e) {
        e.preventDefault();
        clearForm();
    });

    $('.link-slip-btn').click(function(e) {
        e.preventDefault();
        linkSlip();   
    });

    $('.unlink-slip-btn').click(function(e) {
        e.preventDefault();
        unlinkSlip();
    });

    //------------- Summary Events ---------------------------------
    $('#variance_exception').change(function() {
        var batchId = $('#batch_id').val();
        if (this.checked) {
            setAsException(batchId, true); // See de_data_navigation.js
        } else {
            setAsException(batchId, false);
        }
    });    

    //------------- Form Control Events ---------------------------------
    $('.save-btn').click(function(e) {
        e.preventDefault();
        preSaveNoValidation(true, false, false);
    });        

    $('.complete-next-btn').click(function(e) {
        e.preventDefault();
        preSave(false, true, true);
    });    

    $('.complete-exit-btn').click(function(e) {
        e.preventDefault();
        preSave(false, false, true);
    });

    $('.save-next-btn').click(function(e) {
        e.preventDefault();
        preSaveNoValidation(false, true, false);
    });

    $('.save-exit-btn').click(function(e) {
        e.preventDefault();
        preSaveNoValidation(false, false, false);
    });
});

function addNewSlip() {
    if (Form.validate(false)) {
        saveSlip(); // Save the current content
        Form.clear(false);        
        
        slipPage = slipMap.count() + 1;
        saveSlip(); // Save a fresh entry
        
        $('#currentSlipPage').html(slipPage);        
        $('#totalSlips').html(slipMap.count());
        $('.first-slip-btn').removeClass('disabled');   
        $('.prev-slip-btn').removeClass('disabled');   
        $('.next-slip-btn').addClass('disabled');     
        $('.last-slip-btn').addClass('disabled');
        $('.insert-slip-btn').removeClass('disabled');
        $('.delete-slip-btn').removeClass('disabled');                            

        refreshTransTypeDependentFields();
        $(slipRequiredFields).addClass('required');
        $('#other_exception_detail_wrapper').addClass('hidden');
        $('#transaction_date').focus();
        
        if (imgArray.length > 1) {
            $('.slip-image').html('');
            $('.link-slip-btn').removeClass('hidden');
            $('#image_id').val('');
            $('.unlink-slip-btn').addClass('hidden');
        } else {
            // Retain linked image if only 1 is found. See de_form_events.js
            linkSlip();
            $('.unlink-slip-btn').addClass('hidden');    
            $('.link-slip-btn').addClass('hidden');  
        }
    } 
}

function insertSlip() {
    if (Form.validate(false)) {
        // Make sure to save the current slip to keep any changes prior to inserting.
        saveSlip();
            
        // Keep copy of all left and right values of the current position.
        var beforeMap = new HashMap();
        var afterMap = new HashMap();
        var afterKey = slipPage;
        slipMap.forEach(function(value, key) {
            if (key < slipPage) {
                beforeMap.set(key, value);
            }
            if (key >= afterKey) {       
                afterKey++; // Make sure add 1 to key immediately to signify next value.                 
                afterMap.set(afterKey, value);                                        
            }
        });

        // Clear all values.
        slipMap.clear();
                
        // Rebuild left values
        beforeMap.forEach(function(value, key) {
            slipMap.set(key, value);
        });        

        // Rebuild right values
        afterMap.forEach(function(value, key) {
            slipMap.set(key, value);
        });

        // Insert a new value in the map using the new and current position.
        saveSlip();
        
        $('#totalSlips').html(slipMap.count());

        // Clear form and restore required field markers.
        Form.clear(false);
        $(slipRequiredFields).addClass('required');

        $('.prev-slip-btn').removeClass('disabled'); 
        $('.first-slip-btn').removeClass('disabled'); 
        $('.next-slip-btn').removeClass('disabled'); 
        $('.last-slip-btn').removeClass('disabled');         
        $('.delete-slip-btn').removeClass('disabled'); 
        
        $('.link-slip-btn').removeClass('hidden');
        $('.unlink-slip-btn').addClass('hidden');
        $('#transaction_date').focus();
    }
}

function deleteSlip() {
    $('.custom-text').html('<p>Are you sure you want to delete transaction <strong>' + slipPage + '</strong>? Click OK to proceed.</p>');    
        $('.ui.tiny.modal.delete')
        .modal({
            inverted : true,
            closable : true,
            observeChanges : true, // <-- Helps retain the modal position on succeeding show.
            onDeny : function(){
                // Do nothing
            },
            onApprove : function() {
                // Keep copy of all left and right values of the current position.
                var beforeMap = new HashMap();
                var afterMap = new HashMap();
                var afterKey = slipPage;
                slipMap.forEach(function(value, key) {
                    if (key < slipPage) {
                        beforeMap.set(key, value);
                    }
                    if (key > afterKey) {                        
                        afterMap.set(afterKey, value);                        
                        afterKey++;
                    }
                });
                
                // Clear all values.
                slipMap.clear();
                
                // Rebuild values
                beforeMap.forEach(function(value, key) {
                    slipMap.set(key, value);
                });
                afterMap.forEach(function(value, key) {
                    slipMap.set(key, value);
                });
                
                if (slipPage > slipMap.count() && slipPage > 1) {
                    slipPage--;
                    $('#currentSlipPage').html(slipPage);
                }
                $('#totalSlips').html(slipMap.count());

                Form.clear(false);

                // Load the next value.
                slipMap.get(slipPage).forEach(function(value, key) {
                    setFieldValue(key, value); // See de_data_navigation.js
                }); 
                
                if (slipPage == slipMap.count()) {
                    $('.next-slip-btn').addClass('disabled'); 
                    $('.last-slip-btn').addClass('disabled'); 
                    $('.insert-slip-btn').addClass('disabled'); 
                }

                if (slipMap.count() == 1) {
                    $('.prev-slip-btn').addClass('disabled'); 
                    $('.first-slip-btn').addClass('disabled'); 
                    $('.delete-slip-btn').addClass('disabled'); 
                }

                calculateAmount(); // See de_data_navigation.js

                //toastr.success('Transaction was deleted successfully.');                
            }
        })
        .modal('show');   
}

function clearForm() {
    Form.clear(false);
    Form.resetErrors(false);
    $(slipRequiredFields).addClass('required');
}

function linkSlip() {
    var fileName = imgArray[imgNavIndex].path.match(/[^/]*$/g)[0];
    var idField = $('#image_id');
    var fileField = $('#image_file');
    var wrapper = $('#image_file_wrapper');
    
    idField.val(imgArray[imgNavIndex].id);
    fileField.val(fileName);
    wrapper.removeClass('error');
    
    $('.unlink-slip-btn').removeClass('hidden');    
    $('.link-slip-btn').addClass('hidden');       
    
    // For Verify Only
    if ($('#session_task_name').val().indexOf('Verify') != -1) {
        if (rawSlipMap.get(slipPage)) {
            var rawFile = rawSlipMap.get(slipPage).get(fileField[0].id); // See de_data_retrieval.js for map object            
            if(rawFile && fileField.val() !== rawFile) {    
                hideMessage(fileField[0].id); // See de_verify.js
                showMessage(fileField[0].id, rawFile, rawFile); // See de_verify.js
            } else {
                hideMessage(fileField[0].id); // See de_verify.js
            }
        }
    }  
}

function unlinkSlip() {
    $('#image_file').val('');
    $('#image_id').val('');
    $('.link-slip-btn').removeClass('hidden');    
    $('.unlink-slip-btn').addClass('hidden');
}

function preSave(isSaveOnly, isSaveNew, isComplete) {    
    var headerValidationResult = Form.validate(true);        
    var slipValidationResult = true;
    if ($('#batch_pull_reason_id').val() == 0 || $('#batch_pull_reason_id').val() == '') {
        slipValidationResult = Form.validate(false);
    }
    if(headerValidationResult) {
        if (headerValidationResult && slipValidationResult) {            
            var wrapper = $('#variance_exception_wrapper');
            $('#variance_alert').remove();
            if ((parseInt($('#variance').val()) < 0 || parseFloat($('#variance').val()) < 0) && !$('#variance_exception').prop('checked')) { // Do not proceed with variance.                
                $(wrapper).addClass('error');
                wrapper.append('<div class="ui basic red pointing prompt label transition" id="variance_alert">' +
                                '<span id="variance_msg">With negative variance</span>' +
                                '</div>');
                
                // var resp = confirm('Warning: This Batch has negative variance and should be tagged as exception. Click OK to ignore and proceed.');
                // if (resp == false) {
                //     return;
                // }
                return;                
            } else {
                $(wrapper).removeClass('error');                
            }
            
            if ($('#customer_reference_identifier').val().length > 17) {
                var wrapper = $('#customer_reference_identifier_wrapper');
                $('#customer_reference_identifier_alert').remove();
                $(wrapper).addClass('error');
                wrapper.append('<div class="ui basic red pointing prompt label transition" id="customer_reference_identifier_alert">' +
                                '<span id="customer_reference_identifier_msg">More than 17 chars</span>' +
                                '</div>');
                return;
            }

            if ($('#merchant_order_number').val().length > 25) {
                var wrapper = $('#merchant_order_number_wrapper');
                $('#merchant_order_number_alert').remove();
                $(wrapper).addClass('error');
                wrapper.append('<div class="ui basic red pointing prompt label transition" id="merchant_order_number_alert">' +
                                '<span id="merchant_order_number_msg">More than 25 chars</span>' +
                                '</div>');
                return;                
            }

            if ($('#session_task_name').val().indexOf('Verify') != -1) {
                validateTransCount(isSaveOnly, isSaveNew, isComplete);
            } else {
                executeWrite(isSaveOnly, isSaveNew, isComplete);
            }
        }            
    }
}

function preSaveNoValidation(isSaveOnly, isSaveNew, isComplete) {
    var wrapper = $('#variance_exception_wrapper');
    $('#variance_alert').remove();
    if ((parseInt($('#variance').val()) < 0 || parseFloat($('#variance').val()) < 0) && !$('#variance_exception').prop('checked')) { // Do not proceed with variance.                
        $(wrapper).addClass('error');
        wrapper.append('<div class="ui basic red pointing prompt label transition" id="variance_alert">' +
                        '<span id="variance_msg">With negative variance</span>' +
                        '</div>');
        
        // var resp = confirm('Warning: This Batch has negative variance and should be tagged as exception. Click OK to ignore and proceed.');
        // if (resp == false) {
        //     return;
        // } 
        return;
    } else {
        $(wrapper).removeClass('error');                
    }

    if ($('#session_task_name').val().indexOf('Verify') != -1) {
        validateTransCount(isSaveOnly, isSaveNew, isComplete);
    } else {
        executeWrite(isSaveOnly, isSaveNew, isComplete);
    }
}

// For Verify Only
// Check if DE slip count matches with verify slips.
function validateTransCount(isSaveOnly, isSaveNew, isComplete) {    
    if (!isSaveOnly && slipMap.size != rawSlipMap.size) {
        warningPassed = false;
        $('.warning-text').html('<p>Your transaction count (' + slipMap.size + ') is ' + (slipMap.size < rawSlipMap.size ? 'less' : 'greater') + ' than the DE transactions (' + rawSlipMap.size + '). Kindly check.</p>');
        $('.modal.warning')
        .modal({
            inverted : true,
            closable : true,
            autofocus: false,
            observeChanges : true, // <-- Helps retain the modal position on succeeding show.
            onDeny : function(){
                // Do nothing...
            },
            onApprove : function() {
                executeWrite(isSaveOnly, isSaveNew, isComplete);
            }
        })
        .modal('show');
    } else {
        executeWrite(isSaveOnly, isSaveNew, isComplete);
    }
}

function executeWrite(isSaveOnly, isSaveNew, isComplete) {
    if (isComplete) {
        var resp = confirm('Are you sure you want to complete batch ' + $('#batch_id').val() + '? Click OK to proceed.');
        if (resp == true) {
            saveBatch(isSaveOnly, isSaveNew, true); // See de_data_recording.js
        }

        // $('.custom-text').html('<p>Are you sure you want to complete batch <strong>' + $('#batch_id').val() + '</strong>? Click OK to proceed.</p>');

        // var modal = $('.modal:not(div.Transaction, div.warning)')
        // .modal({
        //     inverted : true,
        //     closable : true,
        //     autofocus: false,
        //     observeChanges : true, // <-- Helps retain the modal position on succeeding show.
        //     onDeny : function(){
        //         // Do nothing
        //     },
        //     onApprove : function() {
        //         saveBatch(isSaveOnly, isSaveNew, true); // See de_data_recording.js
        //     },
        //     onVisible : function() {
        //         $(document).on('keydown', function(e) {                    
        //             var keyCode = e.keyCode || e.which;
        //             if (keyCode == 13) { 
        //                 //e.preventDefault();
        //                 if($('.active.modal')) {
        //                     alert();    
        //                     //saveBatch(isSaveOnly, isSaveNew, true); // See de_data_recording.js
        //                     $('.active.modal').modal('hide');
        //                 }                           
        //             }
        //         });
        //     }
        // })
        // .modal('show');     


    } else {
        saveBatch(isSaveOnly, isSaveNew, false); // See de_data_recording.js
    } 
}