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
            getMerchantInfo($(this).val()); // See de_data_retrieval.js
            padZero($(this));
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
            } else {
                $('#other_currency_wrapper').addClass('hidden');
                $('#currency_id_wrapper').removeClass('hidden');
                if (value > 0) {
                    if (this.value != '') $('#currency_id_wrapper').removeClass('error');
                } else {
                    $(this).dropdown('restore defaults');
                }
            }
        }
    });

    $('#otherCurrencyBtn').click(function(e) {
        e.preventDefault();
        $('#other_currency_wrapper').addClass('hidden');
        $('#other_currency').val('');
        $('#currency_id_wrapper').removeClass('hidden');
        $('#currency_id_dropdown').removeClass('hidden');
        $('#currency_id_dropdown').dropdown('restore defaults');
    });

    $('#dcn').blur(function() {
        padZero($(this));
        var wrapper = $('#' + this.id + '_wrapper');       
        if (this.value == '' || this.value == '0000000') {
            // Reset formatting
            $(wrapper).removeClass('error');
            $('#' + this.id + '_alert').remove();
            // Add formatting
            $(wrapper).addClass('error');
            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                    '<span id="' + this.id + '_msg">Invalid Batch DCN</span>' +
                    '</div>');
        } else {       
            $(wrapper).removeClass('error');
            $('#' + this.id + '_alert').remove();    
            
            var params = {};
            params.merchant_number = $('#merchant_number').val();
            params.dcn = $('#dcn').val();
            params.deposit_amount =  $('#deposit_amount').val();
            params.region_code = $('#region_code').val();
            params.task_id = $('#session_task_id').val();
            
            $.post('../merchant_header/getsame/', params, function (hasMatch) {   
                console.log(hasMatch)
                if (hasMatch) {
                    $('#' + this.id + '_alert').remove();
                    $(wrapper).addClass('error');
                    $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                            '<span id="' + this.id + '_msg">Invalid Batch DCN</span>' +
                            '</div>');
                } else {
                    $(wrapper).removeClass('error');
                    $('#' + this.id + '_alert').remove();
                }
            });
        }    
    });   
    
    $('#dcn').keyup(function() {
        this.value = this.value.replace(/[^0-9]/, '');
    }); 

    $('#deposit_date').blur(function() {
        if (this.value != '') $('#deposit_date_wrapper').removeClass('error');
    });  
    
    $('#deposit_amount').blur(function() {
        toCurrency($(this)); // See util.js
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
        this.value = this.value.replace(/[^0-9.]/, '');
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
        if (this.value != '') $('#transaction_date_wrapper').removeClass('error');
    });

    $('#card_number').blur(function() {
        var wrapper = $('#' + this.id + '_wrapper');
        var alert = $('#' + this.id + '_alert');
        var msg = $('#' + this.id + '_msg');
        var logo = $('#cardLogo');
        if (!validateCard($(this).val())) { // See utils.js
            $(alert).remove();
            $(wrapper).addClass('error');
            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                    '<span id="' + this.id + '_msg">Invalid Credit Card number</span>' +
                    '</div>');
            $(logo).attr('src', '../public/img/card/private.png')
        } else {
            $(wrapper).removeClass('error');       
            $(alert).remove();
            var cardType = getCardType($(this).val());
            if (this.value.trim() != '') {
                switch (cardType) {
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
    });

    $('#card_number').keyup(function() {
        this.value = this.value.replace(/[^0-9]/, '');
    });

    $('#authorization_code').blur(function() {
        if (this.value != '') $('#authorization_code_wrapper').removeClass('error');
        this.value = this.value.toUpperCase();
        var wrapper = $('#' + this.id + '_wrapper');
        // Check length of keyed information.
        if (this.value.length > 0 && this.value.length < this.minLength) {
            $('#' + this.id + '_alert').remove();
            $(wrapper).addClass('error');
            $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="' + this.id + '_alert">' +
                    '<span id="' + this.id + '_msg">Invalid Authorization Code</span>' +
                    '</div>');
        } else {
            $(wrapper).removeClass('error');
            $('#' + this.id + '_alert').remove();
        }
    }); 

    $('#transaction_amount').blur(function() {
        toCurrency($(this)); // See util.js
        if (this.value != '') $('#transaction_amount_wrapper').removeClass('error');
        saveSlip(); // Make sure to save the current slip to apply amount.
        calculateAmount(); // See de_data_navigation.js
    }); 

    $('#transaction_amount').keyup(function() {
        this.value = this.value.replace(/[^0-9.]/, '');
    });

    //------------- Transaction Control Events ---------------------------------
    $('.more-btn').click(function(e) {
        e.preventDefault();
        
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
            $('#card_number').focus();
        }        
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

    // var prevInt;
    // $('.prev-slip-btn').mousedown(function() {        
    //     prevInt = setInterval(navigateToPrevSlip, 100);
    // }).mouseup(function() {
    //     clearInterval(prevInt);
    // });    

    // var nextInt;
    // $('.next-slip-btn').mousedown(function() {        
    //     nextInt = setInterval(navigateToNextSlip, 100);
    // }).mouseup(function() {
    //     clearInterval(nextInt);
    // });        

    $('.insert-slip-btn').click(function(e) {
        e.preventDefault();
        
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
        
        Form.setFocus(false);
    });

    $('.delete-slip-btn').click(function(e) {
        e.preventDefault();
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
    });

    $('.reset-slip-btn').click(function(e) {
        e.preventDefault();
        Form.clear(false);
        Form.resetErrors(false);
        $(slipRequiredFields).addClass('required');
    });

    $('.link-slip-btn').click(function(e) {
        e.preventDefault();
        var fileName = imgArray[imgNavIndex].path.match(/[^/]*$/g)[0];
        $('.slip-image').html(fileName);
        $('.unlink-slip-btn').removeClass('hidden');
        $('#image_id').val(imgArray[imgNavIndex].id);
        $(this).addClass('hidden');        
    });

    $('.unlink-slip-btn').click(function(e) {
        e.preventDefault();
        $('.slip-image').html('');
        $('.link-slip-btn').removeClass('hidden');
        $('#image_id').val('');
        $(this).addClass('hidden');
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
    $('.complete-exit-btn').click(function(e) {
        e.preventDefault();
        preSave(false, true);
    });

    $('.complete-next-btn').click(function(e) {
        e.preventDefault();
        preSave(true, true);
    });
    
    $('.save-exit-btn').click(function(e) {
        e.preventDefault();
        preSave(false, false);
    });

    $('.save-next-btn').click(function(e) {
        preSave(true, false);
    });
});

function preSave(isSaveNew, isComplete) {
    var headerValidationResult = Form.validate(true);        
    var slipValidationResult = true;
    if ($('#batch_pull_reason_id').val() == 0 || $('#batch_pull_reason_id').val() == '') {
        slipValidationResult = Form.validate(false);
    }
    if(headerValidationResult) {            
        if (headerValidationResult && slipValidationResult) {
            if (isComplete) {
                $('.custom-text').html('<p>Are you sure you want to complete batch <strong>' + $('#batch_id').val() + '</strong>? Click OK to proceed.</p>');

                $('.modal:not(div.Transaction)')
                .modal({
                    inverted : true,
                    closable : true,
                    observeChanges : true, // <-- Helps retain the modal position on succeeding show.
                    onDeny : function(){
                        // Do nothing
                    },
                    onApprove : function() {
                        saveBatch(isSaveNew, true); // See de_data_recording.js
                    }
                })
                .modal('show');
            } else {
                saveBatch(isSaveNew, false); // See de_data_recording.js
            }            
        }            
    }
}