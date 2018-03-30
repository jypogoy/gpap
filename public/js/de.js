var slipPage = 1;
var slipMap; // <index, map<field_id, value>>   
var slipRequiredFields;
var headerRequiredFields;

$(function() {              

    slipRequiredFields = $('#transactionDataForm').find('.required');
    headerRequiredFields = $('#headerDataForm').find('.required');

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
     
    $('#batch_pull_reason_id_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');        
            overrideHeader(value);
        }
    });

    $('#transaction_type_id_dropdown').dropdown({
        onChange: function() {            
            refreshTransTypeDependentFields();
            var value = $(this).dropdown('get value');            
            if (value > 0) {
                $('#transaction_type_id_wrapper').removeClass('error');
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

    $('#installment_months_id_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');            
            if (value == 0) {       
                $(this).dropdown('restore defaults');         
            } else {                
                $('#installment_months_id_wrapper').removeClass('error');
            }
        }
    });
    
    $('#slip_pull_reason_id_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value'); 
            overrideSlip(value);            
        }
    });

    $('#exception_id_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');   
            if (value == 0) {
                $(this).dropdown('restore defaults');                
            }
            var text = $(this).dropdown('get text');     
            if (text.indexOf('Others') != -1) {
                $('#other_exception_detail').parent().removeClass('hidden');
            } else {
                $('#other_exception_detail').parent().addClass('hidden');
                $('#other_exception_detail').focus();
            }
            $('#other_exception_detail').val(''); // Clear the previous detail.
        }
    });
    
    getTransactionTypes();
    getPullReasons();
    getInstallmentMonths();
    getExceptions();
    
    getContents();

    $('#merchant_number').focus();
});

function overrideHeader(pullReasonId) {
    if (pullReasonId && pullReasonId > 0) {
        $('#transactionDataForm').filter(":visible").find('.field, .fields').addClass('disabled');                
        $(headerRequiredFields).removeClass('required');
        Form.resetErrors(true);
        Form.resetErrors(false);
        $('.slip-controls').addClass('hidden');
    } else {
        $('#transactionDataForm').filter(":visible").find('.field, .fields').removeClass('disabled');                
        $('#batch_pull_reason_id_dropdown').dropdown('restore defaults');
        $(headerRequiredFields).addClass('required');
        $('.slip-controls').removeClass('hidden');
    }
}

function overrideSlip(pullReasonId) {
    if (pullReasonId && pullReasonId > 0) {
        $(slipRequiredFields).removeClass('required');
        Form.resetErrors(false);
    } else {
        $('#slip_pull_reason_id_dropdown').dropdown('restore defaults');
        $(slipRequiredFields).addClass('required');
    }
}