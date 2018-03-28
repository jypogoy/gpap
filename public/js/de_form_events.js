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
            searchMerchant($(this).val());
            padZero($(this));
        }
        this.value = this.value.replace(/[^0-9]/, '');
    });
    
    $('#merchant_number').blur(function() {
        if (this.value != '') $('#merchant_number_wrapper').removeClass('error');
    });

    $('#currency_code_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');            
            if (value > 0) {
                Form.validate(true);
            } else {
                $(this).dropdown('restore defaults');
            }
        }
    });

    $('#dcn').blur(function() {
        padZero($(this));
        Form.validate(true);
    });   
    
    $('#dcn').keyup(function() {
        this.value = this.value.replace(/[^0-9]/, '');
    }); 

    $('#deposit_date').blur(function() {
        if (this.value != '') $('#deposit_date_wrapper').removeClass('error');
    });  
    
    $('#deposit_amount').blur(function() {
        toCurrency($(this));
        if (this.value != '') $('#deposit_amount_wrapper').removeClass('error');
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

    $('#credit_card_number').blur(function() {
        if (!validateCard($(this).val())) {
            $('#' + this.id + '_wrapper').addClass('error');           
            $('#' + this.id + '_alert').addClass('visible');
            $('#' + this.id + '_msg').html('Invalid Credit Card number');
            $('#cardLogo').attr('src', '../public/img/card/private.png')
            $(this).select();
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

    $('#credit_card_number').keyup(function() {
        this.value = this.value.replace(/[^0-9]/, '');
    });

    $('#authorization_code').blur(function() {
        padZero($(this));
        if (this.value != '') $('#authorization_code_wrapper').removeClass('error');
    }); 

    $('#transaction_amount').blur(function() {
        toCurrency($(this));
        if (this.value != '') $('#transaction_amount_wrapper').removeClass('error');
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
            $('.prev-slip-btn').removeClass('disabled');   
            $('.next-slip-btn').addClass('disabled');     

            refreshTransTypeDependentFields();
        }        
    });

    $('.prev-slip-btn').click(function(e) {
        e.preventDefault();
        navigateToPrevSlip();
    });

    // var prevInt;
    // $('.prev-slip-btn').mousedown(function() {        
    //     prevInt = setInterval(navigateToPrevSlip, 100);
    // }).mouseup(function() {
    //     clearInterval(prevInt);
    // });

    $('.next-slip-btn').click(function(e) {
        e.preventDefault();
        navigateToNextSlip();
    });

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
                    saveSlip(); // Save a fresh entry
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
    });

    //------------- Form Control Events ---------------------------------
    $('.save-exit-btn').click(function(e) {
        e.preventDefault();
        var headerValidationResult = Form.validate(true);
        var slipValidationResult = Form.validate(false);
        if(headerValidationResult && slipValidationResult) saveBatch(false);
    });
});