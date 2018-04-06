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
            searchMerchant($(this).val()); // See de_data_retrieval.js
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
        if (this.value != '') $('#dcn_wrapper').removeClass('error');
    });   
    
    $('#dcn').keyup(function() {
        this.value = this.value.replace(/[^0-9]/, '');
    }); 

    $('#deposit_date').blur(function() {
        if (this.value != '') $('#deposit_date_wrapper').removeClass('error');
    });  
    
    $('#deposit_amount').blur(function() {
        toCurrency($(this)); // See util.js
        if (this.value != '') $('#deposit_amount_wrapper').removeClass('error');
        calculateAmount(); // See de_data_navigation.js
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
        if (!validateCard($(this).val())) {
            $('#' + this.id + '_wrapper').addClass('error');           
            $('#' + this.id + '_alert').addClass('visible');
            $('#' + this.id + '_msg').html('Invalid Credit Card number');
            $('#cardLogo').attr('src', '../public/img/card/private.png')
        } else {
            $('#' + this.id + '_wrapper').removeClass('error');       
            $('#' + this.id + '_alert').removeClass('visible');
            var cardType = getCardType($(this).val());
            switch (cardType) {
                case 'Visa':
                    $('#cardLogo').attr('src', '../public/img/card/visa.png')
                    break;
                
                case 'Mastercard':
                    $('#cardLogo').attr('src', '../public/img/card/mastercard.png')
                    break;    

                case 'JCB':
                    $('#cardLogo').attr('src', '../public/img/card/jcb.png')
                    break;     
            
                default:
                    $('#cardLogo').attr('src', '../public/img/card/private.png')
                    break;
            }
        }
    });

    $('#card_number').keyup(function() {
        this.value = this.value.replace(/[^0-9]/, '');
    });

    $('#authorization_code').blur(function() {
        if (this.value != '') $('#authorization_code_wrapper').removeClass('error');
        this.value = this.value.toUpperCase();
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

            refreshTransTypeDependentFields();
            $(slipRequiredFields).addClass('required');
            $('#other_exception_detail_wrapper').addClass('hidden');
            Form.setFocus(false);
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

    $('.delete-slip-btn').click(function(e) {
        e.preventDefault();
        $('.custom-text').html('<p>Are you sure you want to delete the current transaction? Click OK to proceed.</p>');    
        $('.ui.tiny.modal.delete')
        .modal({
            inverted : true,
            closable : true,
            observeChanges : true, // <-- Helps retain the modal position on succeeding show.
            onDeny : function(){
                // Do nothing
            },
            onApprove : function() {
                if (slipPage == 1) {
                    Form.clear(false);
                    saveSlip(); // Save a fresh entry. See de_data_navigation.js
                } else {
                    slipMap.remove(slipPage);
                    if (slipMap.count() - 1 <= 0) {
                        navigateToNextSlip();
                    } else {
                        navigateToPrevSlip();
                    }
                }
                toastr.success('Transaction was deleted successfully.');                
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