var slipPage = 1;
var slipMap;    

$(function() {              

    slipMap = new HashMap(); 

    saveSlip(); // Alwas add a fresh record on the map

    $('#currentSlipPage').html(slipPage);
    $('#totalSlips').html(slipMap.count());    

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
 
    var headerRequiredFields = $('#headerDataForm').find('.required');
    $('#batch_pull_reason_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');        
            if (value > 0) {
                $('#transactionDataForm').filter(":visible").find('.field, .fields').addClass('disabled');                
                $(headerRequiredFields).removeClass('required');
                Form.resetErrors(true);
                Form.resetErrors(false);
                $('.slip-controls').addClass('hidden');
            } else {
                $('#transactionDataForm').filter(":visible").find('.field, .fields').removeClass('disabled');                
                $(this).dropdown('restore defaults');
                $(headerRequiredFields).addClass('required');
                $('.slip-controls').removeClass('hidden');
            }
        }
    });

    $('#transaction_type_dropdown').dropdown({
        onChange: function() {            
            refreshTransTypeDependentFields();
            var value = $(this).dropdown('get value');            
            if (value > 0) {
                $('#transaction_type_wrapper').removeClass('error');
            } else {
                $(this).dropdown('restore defaults');
            }
        }
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

    $('#installment_months_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');            
            if (value == 0) {       
                $(this).dropdown('restore defaults');         
            } else {                
                $('#installment_months_wrapper').removeClass('error');
            }
        }
    });

    var slipRequiredFields = $('#headerDataForm').find('.required');
    $('#slip_pull_reason_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');        
            if (value > 0) {
                $('#batch_pull_reason_field').nextAll('.field, .fields').addClass('disabled');
                $(slipRequiredFields).removeClass('required');
                Form.resetErrors('headerDataForm');
            } else {
                $('#batch_pull_reason_field').nextAll('.field, .fields').removeClass('disabled');
                $(this).dropdown('restore defaults');
                $(slipRequiredFields).addClass('required');
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
    getExceptions();
    getInstallmentMonths();
    
    $('#merchant_number').focus();
});
