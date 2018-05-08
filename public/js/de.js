var slipPage = 1;
var slipMap; // <index, map<field_id, value>>   
var slipRequiredFields;
var headerRequiredFields;
var merchantInfoMap; // <db_field, db_value>  
var currNoDecimal = false;

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
            var text = $(this).dropdown('get text');    
            if (text.indexOf('Supporting') != -1) { // Clear form content if Supporting Document.
                Form.clearOnSupportingDoc();
            }          
        }
    });

    // $('#slip_pull_reason_id_dropdown').find('.search').blur(function() {        
    //     var text = $('#slip_pull_reason_id_dropdown').dropdown('get text');    
    //     if (text.indexOf('Supporting') != -1) { // Clear form content if Supporting Document.
    //         Form.clear(false, this.id);
    //     }
    // });

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
    merchantInfoMap = new HashMap();
    currencyMap = new HashMap();
    batchPullReasonMap = new HashMap();
    installMonthsMap = new HashMap();
    slipPullReasonMap = new HashMap();
    exceptionMap = new HashMap();

    if ($('#session_from_edits').val()) {
        if ($('#session_task_name').val().indexOf('Entry') != -1) {
            getKeyer(); // See de_data_retrieval.js
        } else if ($('#session_task_name').val().indexOf('Verify') != -1) {
            getVerifier(); // See de_data_retrieval.js
        } else if ($('#session_task_name').val().indexOf('Balancing') != -1) {
            getBalancer(); // See de_data_retrieval.js
        }
    }

    if ($('#session_task_name').val().indexOf('Balancing') != -1) {
        getLastCompleted($('#batch_id').val()).then(function(lastCompletedData) {
            getRegionCurrency();
            getPullReasons();
            getInstallmentMonths();
            getExceptions();
            checkHeaderIfExists().then(function(header) {
                getContents(lastCompletedData, header);
            });      
            if (!$('#session_from_edits').val()) getVerifier(); // See de_data_retrieval.js
            //prepBalancingFields();
        });
    } else {
        getRegionCurrency();
        getPullReasons();
        getInstallmentMonths();
        getExceptions();
        getContents();
    }        

    if ($('#session_task_name').val().indexOf('Verify') != -1) {
        getRawContents();
        if (!$('#session_from_edits').val()) getKeyer(); // See de_data_retrieval.js        
    } else {
        $('.prev-operator').addClass('hidden');
    }

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
        $('.slip-field:not(.auto-fill, .image-link)').removeAttr('disabled');
        $('.slip-dropdown').removeClass('disabled');
        $('.slip-controls').removeClass('hidden');
    }
    if ($('#session_task_name').val().indexOf('Balancing') != -1) {
        //prepBalancingFields(); 
    }
}

function overrideSlip(pullReasonId) {
    if (pullReasonId && pullReasonId > 0) {
        $(slipRequiredFields).removeClass('required');
        Form.resetErrors(false);
        $('#image_file_wrapper').addClass('required');
    } else {
        $('#slip_pull_reason_id_dropdown').dropdown('restore defaults');
        $(slipRequiredFields).addClass('required');
    }
}

function prepBalancingFields() {    
    $('.header-field:not(.balancing-enabled)').attr('disabled', true);
    $('.header-dropdown').addClass('disabled');
    $('.slip-field:not(.balancing-enabled)').attr('disabled', true);
    $('.slip-dropdown').addClass('disabled');
    $('.balancing-enabled').prev().css('color', 'orange');
}