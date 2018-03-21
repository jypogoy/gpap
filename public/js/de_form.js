$(function () {      

    $('form').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) { 
            e.preventDefault();
            return false;
        }
    });

    $('#merchantId').on('keyup', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13 && $(this).val().length > 0) { 
            searchMerchant($(this).val());
        }
    });

    $('#merchantId').blur(function() {
        if ($(this).val().length > 0) searchMerchant($(this).val());
        padZero($(this));
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

    $('#pan').blur(function() {
        if (!validateCard($(this).val())) {
            $('#' + this.id + '_div').addClass('error');           
            $('#' + this.id + '_alert').addClass('visible');
            $('#' + this.id + '_msg').html('Invalid Credit Card number');
            $(this).select();
        } else {
            $('#' + this.id + '_div').removeClass('error');       
            $('#' + this.id + '_alert').removeClass('visible');
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

    $('#depositAmount').blur(function() {
        toCurrency($(this));
    });  

    $('#transactionAmount').blur(function() {
        toCurrency($(this));
    }); 

});

function searchMerchant($merchantId) {
    $.post('merchant/get/' + $merchantId, function (data) {
        if (!data) {
            toastr.warning('The search did not match any merchant.');                    
            $('#merchantName').val('');
            $('#regionCode').val('');
        } else {
            $('#merchantName').val(data.dba_name);
            $('#regionCode').val(data.country_code);
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
    $.post('currency/getbyregion/' + $regionCode, function (data) {
        if (!data) {
            toastr.warning('The search did not match any currency.'); 
        } else {
            var menuWrapper = $('#currencyDropDown .menu');
            $(menuWrapper).empty();
            data.forEach(currency => {
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