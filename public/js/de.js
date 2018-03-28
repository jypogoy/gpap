var slipPage = 1;
var slipMap;    

$(function () {          

    slipMap = new HashMap(); 

    saveSlip(); // Alwas add a fresh record on the map

    $('#currentSlipPage').html(slipPage);
    $('#totalSlips').html(slipMap.count());    

    $('.more-btn').click(function(e) {
        e.preventDefault();
        
        saveSlip(); // Save the current content
        clearSlipForm();        
        
        slipPage = slipMap.count() + 1;
        saveSlip(); // Save a fresh entry
        
        $('#currentSlipPage').html(slipPage);        
        $('#totalSlips').html(slipMap.count());
        $('.prev-slip-btn').removeClass('disabled');   
        $('.next-slip-btn').addClass('disabled');     

        refreshTransTypeDependentFields();
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
                slipMap.remove(slipPage);
                if (slipMap - 1 <= 0) {
                    navigateToNextSlip();
                } else {
                    navigateToPrevSlip();
                }
            }
        })
        .modal('show');        
    });

    $('form').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
            e.preventDefault();
            return false;
        }
    });

    $('#merchant_number').on('keyup', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13 && $(this).val().length > 0) { 
            searchMerchant($(this).val());
            padZero($(this));
        }
        this.value = this.value.replace(/[^0-9]/, '');
    });
    
    $('#currency_code_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');            
            if (value > 0) {
                // TODO
            } else {
                $(this).dropdown('restore defaults');
            }
        }
    });

    $('#dcn').blur(function() {
        padZero($(this));
    });   
    
    $('#dcn').keyup(function() {
        this.value = this.value.replace(/[^0-9]/, '');
    });   

    $('#deposit_date_cal').calendar({ 
        type: 'date',
        monthFirst: true,
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = new Array(2 - date.getDate().toString().length + 1).join('0') + date.getDate();            
                var month = new Array(2 - (date.getMonth() + 1).toString().length + 1).join('0') + (date.getMonth() + 1);
                var year = date.getFullYear().toString().substr(-2);
                return month + '/' + day + '/' + year;
            }
        }
    });        

 
    $('#batch_pull_reason_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');            
            if (value > 0) {
                $('#batch_pull_reason_field').nextAll('.field, .fields').addClass('disabled');
            } else {
                $('#batch_pull_reason_field').nextAll('.field, .fields').removeClass('disabled');
                $(this).dropdown('restore defaults');
            }
        }
    });

    $('#transaction_type_dropdown').dropdown({
        onChange: function() {            
            refreshTransTypeDependentFields();
            var value = $(this).dropdown('get value');            
            if (value > 0) {
                // TODO
            } else {
                $(this).dropdown('restore defaults');
            }
        }
    });

    $('#credit_card_number').blur(function() {
        if (!validateCard($(this).val())) {
            $('#' + this.id + '_div').addClass('error');           
            $('#' + this.id + '_alert').addClass('visible');
            $('#' + this.id + '_msg').html('Invalid Credit Card number');
            $('#cardLogo').attr('src', '../public/img/card/private.png')
            $(this).select();
        } else {
            $('#' + this.id + '_div').removeClass('error');       
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

    $('#transaction_date_cal').calendar({ 
        type: 'date',
        monthFirst: true,
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                var day = new Array(2 - date.getDate().toString().length + 1).join('0') + date.getDate();            
                var month = new Array(2 - (date.getMonth() + 1).toString().length + 1).join('0') + (date.getMonth() + 1);
                var year = date.getFullYear().toString().substr(-2);
                return month + '/' + day + '/' + year;
            }
        }
    });

    $('#authorization_code').blur(function() {
        padZero($(this));
    }); 

    $('#deposit_amount').blur(function() {
        toCurrency($(this));
    });  

    $('#deposit_amount').keyup(function() {
        this.value = this.value.replace(/[^0-9.]/, '');
    });

    $('#region_code').keyup(function() {
        this.value = this.value.toUpperCase();
        this.value = this.value.replace(/[^a-zA-Z]/, '');
    });

    $('#transaction_amount').blur(function() {
        toCurrency($(this));
    }); 

    $('#transaction_amount').keyup(function() {
        this.value = this.value.replace(/[^0-9.]/, '');
    });

    $('#installment_months_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');            
            if (value > 0) {
                // TODO
            } else {
                $(this).dropdown('restore defaults');
            }
        }
    });

    $('#slip_pull_reason_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');            
            if (value > 0) {
                // TODO
            } else {
                $(this).dropdown('restore defaults');
            }
        }
    });

    $('#other_exception_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');            
            if (value == 0) {
                $(this).dropdown('restore defaults');
            } else if (value.indexOf('Others') != -1) {
                $('#other_exception_detail').parent().removeClass('hidden');
            } else {
                $('#other_exception_detail').parent().addClass('hidden');
                $('#other_exception_detail').focus();
            }
        }
    });
    
    getTransactionTypes();
    getPullReasons();

    $('.save-exit-btn').click(function(e) {
        e.preventDefault();
        save(false);
    });
});
