var slipPage = 1;
var slipMap; // <index, map<field_id, value>>   
var slipRequiredFields;
var headerRequiredFields;

$(function() {              

    slipRequiredFields = $('#transactionDataForm').find('.required');
    headerRequiredFields = $('#headerDataForm').find('.required');

    slipMap = new HashMap();    

    saveSlip(); // Always add a fresh record on the map. See de_data_navigation.js

    $('#currentSlipPage').html(slipPage);
    $('#totalSlips').html(slipMap.count());    

    $('#deposit_date_cal').calendar({ 
        type: 'date',
        monthFirst: true,
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                return formatDate(date);
            }
        }
    });        
     
    $('#batch_pull_reason_id_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');        
            overrideHeader(value);
        }
    });

    // $('#transaction_type_id_dropdown').dropdown({
    //     onChange: function() {            
    //         refreshTransTypeDependentFields();
    //         var value = $(this).dropdown('get value');            
    //         if (value > 0) {
    //             $('#transaction_type_id_wrapper').removeClass('error');
    //         } else {
    //             $(this).dropdown('restore defaults');
    //         }
    //     }
    // });

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
    
    // See de_data_retrieval.js
    //getTransactionTypes();
    getPullReasons();
    getInstallmentMonths();
    getExceptions();    
    getContents();

    if ($('#session_task_name').val().indexOf('Verify') != -1) getRawContents();

    $('#merchant_number').focus();
    $('.dropdown.icon').removeAttr('tabIndex');
});

function overrideHeader(pullReasonId) {
    if (pullReasonId && pullReasonId > 0) {
        $('#transactionDataForm').filter(":visible").find('.field, .fields').addClass('disabled');                
        $(headerRequiredFields).removeClass('required');
        $(slipRequiredFields).removeClass('required');
        Form.resetErrors(true);
        Form.resetErrors(false);
        $('.slip-field:not(.auto-fill)').attr('disabled', true);
        $('.slip-dropdown').addClass('disabled');
        $('.slip-controls').addClass('hidden');        
    } else {
        $('#transactionDataForm').filter(":visible").find('.field, .fields').removeClass('disabled');                
        $('#batch_pull_reason_id_dropdown').dropdown('restore defaults');
        $(headerRequiredFields).addClass('required');
        $(slipRequiredFields).addClass('required');
        $('.slip-field:not(.auto-fill)').removeAttr('disabled');
        $('.slip-dropdown').removeClass('disabled');
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