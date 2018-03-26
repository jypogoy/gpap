$(function () {          

    var slipMap = new HashMap();

    $('.more-btn').click(function(e) {
        e.preventDefault();
        console.log($('.slip-field'))
    });

    $('form').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
            e.preventDefault();
            return false;
        }
    });

    $('#merchantNumber').on('keyup', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13 && $(this).val().length > 0) { 
            searchMerchant($(this).val());
            padZero($(this));
        }
    });
    
    $('#currencyDropdown').dropdown({
        onChange: function() {
            //TODO
        }
    });

    $('#dcn').blur(function() {
        padZero($(this));
    });    

    $('#depositDate').calendar({ 
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

 
    $('#merchantPullDropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');            
            if (value > 0) {
                $('#merchantPullDropdownField').nextAll('.field, .fields').addClass('disabled');
            } else {
                $('#merchantPullDropdownField').nextAll('.field, .fields').removeClass('disabled');
            }
        }
    });

    $('#transTypeDropdown').dropdown({
        onChange: function() {
            //TODO
        }
    });

    
    $('#pan').blur(function() {
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

    $('#transactionDate').calendar({ 
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

    $('#authCode').blur(function() {
        padZero($(this));
    }); 

    $('#depositAmount').blur(function() {
        toCurrency($(this));
    });  

    $('#transactionAmount').blur(function() {
        toCurrency($(this));
    }); 

    $('#installmentDropdown').dropdown({
        onChange: function() {
            //TODO
        }
    });

    $('#slipPullDropdown').dropdown({
        onChange: function() {
            //TODO
        }
    });
    
    getTransactionTypes();
    getPullReasons();
});

function searchMerchant($merchantNumber) {
    $.post('../merchant/get/' + $merchantNumber, function (data) {
        if (!data) {
            toastr.warning('The search did not match any merchant.');                    
            $('#merchantName').val('');
            $('#regionCode').val('');
            $('#currencyDropdown .menu').empty();
            $('#currencyDropdown .text').remove();
            $('#currencyDropdown').append('<div class="default text">Choose a code</div>');
        } else {
            $('#merchantName').val(data.dba_name);
            //$('#regionCode').val(data.country_code);
            getCurrencies(data.country_code);
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

function getCurrencies($regionCode) {
    $.post('../currency/getbyregion/' + $regionCode, function (data) {
        if (!data) {
            toastr.warning('The search did not match any currency.'); 
        } else {
            var menuWrapper = $('#currencyDropdown .menu');
            $(menuWrapper).empty();
            $.each(data, function(i, currency) {
                $('<div class="item" data-value="' + currency.id + '">' + currency.num_code + ' (' + currency.alpha_code + ')</div>').appendTo(menuWrapper);
            });
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

function getTransactionTypes() {
    $.post('../transaction_type/list', function (data) {
        if (!data) {
            toastr.warning('The search did not match any transaction type.'); 
        } else {
            var menuWrapper = $('#transTypeDropdown .menu');
            $(menuWrapper).empty();
            $.each(data, function(i, transType) {
                $('<div class="item" data-value="' + transType.id + '">' + transType.type + '</div>').appendTo(menuWrapper);
            });
            $('<div class="item" data-value="0">&nbsp;</div>').appendTo(menuWrapper); 
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

function getPullReasons() {
    // Retrieve all reasons for pulling a batch.
    $.post('../pull_reason/getbylevel/Batch', function (data) {
        if (!data) {
            toastr.warning('The search did not match any pull reason.'); 
        } else {
            var menuWrapper = $('#merchantPullDropdown .menu');
            $(menuWrapper).empty();  
            $.each(data, function(i, pullReason) {
                $('<div class="item" data-value="' + pullReason.id + '">' + pullReason.title + ' - ' + pullReason.reason + '</div>').appendTo(menuWrapper);                             
            });
            $('<div class="item" data-value="0">&nbsp;</div>').appendTo(menuWrapper);
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });   
    
    // Retrieve all reasons for pulling a slip or transaction.
    $.post('../pull_reason/getbylevel/Slip', function (data) {
        if (!data) {
            toastr.warning('The search did not match any pull reason.'); 
        } else {
            var menuWrapper = $('#slipPullDropdown .menu');
            $(menuWrapper).empty(); 
            $.each(data, function(i, pullReason) {
                $('<div class="item" data-value="' + pullReason.id + '">' + pullReason.title + (pullReason.reason != null ? ' - ' + pullReason.reason : '') + '</div>').appendTo(menuWrapper);                    
            });
            $('<div class="item" data-value="0">&nbsp;</div>').appendTo(menuWrapper); 
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}