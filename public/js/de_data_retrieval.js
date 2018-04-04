var withHeaderContent = false;
var withSlipContent = false;

var currencyMap;
var batchPullReasonMap;
var installMonthsMap;
var slipPullReasonMap;
var exceptionMap;

var rawHeaderMap; // <field_id, value>
var rawSlipMap; // <index, map<field_id, value>>  
function getRawContents() {    

    rawHeaderMap = new HashMap();
    rawSlipMap = new HashMap();    

    // Get the data entry 1 record.
    var params = {};
    params.batch_id = $('#batch_id').val();
    params.task_id = $('#session_task_id').val();
    $.post('../data_entry/getbycountertask/', params, function (dataEntryData) {
        // Retrieve header contents.
        params = {};
        params.batch_id = $('#batch_id').val();
        params.data_entry_id = dataEntryData.id;
        $.post('../merchant_header/get/', params, function (headerData) {
            if (headerData || headerData.length > 0) {                
                // Add values to header map.
                $.each(headerData, function(key, value) {
                    rawHeaderMap.set(key, value);
                });    
                // Retrieve transactions.
                getSlips(headerData.id);   
            }            
        })
    });
    // Retrieve related transactions.
    function getSlips(headerId) {
        $.post('../transaction/getbyheader/' + headerId, function (data) {
            if (data || data.length > 0) {
                $.each(data, function(id, fieldValueArray) {
                    var slipValueMap = new HashMap();
                    var key;
                    $.each(fieldValueArray, function(id, value) {
                        if (id == 'sequence') {
                            key = value;                        
                        } else {
                            slipValueMap.set(id, value);
                        }                    
                    });
                    rawSlipMap.set(parseInt(key), slipValueMap);
                });                 
            }
        })
    }
}

function getContents() {

    currencyMap = new HashMap();
    batchPullReasonMap = new HashMap();
    installMonthsMap = new HashMap();
    slipPullReasonMap = new HashMap();
    exceptionMap = new HashMap();

    var params = {};
    params.batch_id = $('#batch_id').val();
    params.data_entry_id = $('#data_entry_id').val();
    $.post('../merchant_header/get/', params, function (headerData) {
        if (!headerData || headerData.length == 0) {
            //toastr.warning('This batch does not have any header content.');
        } else {
            withHeaderContent = true;
            $('#merchant_header_id').val(headerData.id);            
            if (headerData.merchant_number) {
                // Load information of dependent fields e.g. currency
                // Get the region or country code.      
                $.post('../merchant/get/' + parseInt(headerData.merchant_number), function (merchantData) { 
                    if (merchantData.stateCountry)  {
                        // Get all currencies with the region.                    
                        $.post('../currency/getbyregion/' + merchantData.stateCountry, function (currencyData) {   
                            
                            // Populate currencies allowed by the recorded merchant.            
                            var menuWrapper = $('#currency_id_dropdown .menu');
                            $(menuWrapper).empty();
                            
                            $.each(currencyData, function(i, currency) {
                                $('<div class="item" data-value="' + currency.id + '">' + currency.num_code + ' (' + currency.alpha_code + ')</div>').appendTo(menuWrapper);
                            });
                            $('<div class="item" data-value="34">Other</div>').appendTo(menuWrapper); 
                            $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper); 

                            // Reinstantiate the currency dropdown to apply changes. See de_form_events.js for similar code                
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
                        })
                    }
                });
            }
            
            // Fill header fields with values.
            $.each(headerData, function(key, value) {
                setFieldValue(key, value); // See de_data_navigation.js
            });

            // Load transactions
            getSlipContents(headerData.id);   
        }            
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

function getSlipContents(headerId) {
    $.post('../transaction/getbyheader/' + headerId, function (data) {
        if (!data || data.length == 0) {
            //toastr.warning('This batch does not have any transactions.');
        } else {     
            withSlipContent = true;
            slipMap.clear(); // Make sure to clear the field map as it is populated initially with blank.
            $.each(data, function(id, fieldValueArray) {
                var slipValueMap = new HashMap();
                var key;
                $.each(fieldValueArray, function(id, value) {
                    if (id == 'sequence') {
                        key = value;                        
                    } else {
                        slipValueMap.set(id, value);
                    }                    
                });
                slipMap.set(parseInt(key), slipValueMap);
            }); 
            // Load initial index as result can be multiple.
            slipMap.get(slipPage).forEach(function(value, key) {
                setFieldValue(key, value); // See de_data_navigation.js
            });                                    

            //$('#currentSlipPage').html(slipPage);        
            $('#totalSlips').html(slipMap.count());
            if (data.length > 1) {
                $('.next-slip-btn').removeClass('disabled'); 
                $('.last-slip-btn').removeClass('disabled'); 
            }
        }                  
    })
    .done(function (msg) {
        refreshTransTypeDependentFields();
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

function searchMerchant(merchantNumber) {
    $.post('../merchant/get/' + merchantNumber, function (data) {
        if (!data) {
            toastr.warning('The search did not match any merchant.');                    
            Form.clear(true);
        } else {
            $('#merchant_name').val(data.doingBusinessAs);
            //$('#regionCode').val(data.country_code);
            getCurrencies(data.stateCountry);
            Form.resetErrors(true);
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

function getCurrencies(regionCode) {
    $.post('../currency/getbyregion/' + regionCode, function (data) {
        if (!data) {
            toastr.warning('The search did not match any currency.'); 
        } else {
            var menuWrapper = $('#currency_id_dropdown .menu');
            $(menuWrapper).empty();
            $.each(data, function(i, currency) {
                currencyMap.set(currency.id, currency); // Keep reference of currencies for verify
                $('<div class="item" data-value="' + currency.id + '">' + currency.num_code + ' (' + currency.alpha_code + ')</div>').appendTo(menuWrapper);
            });
            $('<div class="item" data-value="34">Other</div>').appendTo(menuWrapper); 
            $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper); 
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

// function getTransactionTypes() {
//     $.post('../transaction_type/list', function (data) {
//         if (!data) {
//             toastr.warning('The search did not match any transaction type.'); 
//         } else {
//             var menuWrapper = $('#transaction_type_id_dropdown .menu');
//             $(menuWrapper).empty();
//             $.each(data, function(i, transType) {
//                 $('<div class="item" data-value="' + transType.id + '">' + transType.type + '</div>').appendTo(menuWrapper);
//             });
//             $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper); 
//         }                
//     })
//     .done(function (msg) {
//         // Do nothing...
//     })
//     .fail(function (xhr, status, error) {
//         toastr.error(error);
//     });
// }

function getPullReasons() {
    // Retrieve all reasons for pulling a batch.
    $.post('../pull_reason/getbylevel/Batch', function (data) {
        if (!data) {
            toastr.warning('The search did not match any pull reason.'); 
        } else {
            var menuWrapper = $('#batch_pull_reason_id_dropdown .menu');
            $(menuWrapper).empty();  
            $.each(data, function(i, pullReason) {
                batchPullReasonMap.set(pullReason.id, pullReason); // Keep reference of bath pull reasons for verify
                $('<div class="item" data-value="' + pullReason.id + '">' + pullReason.title + ' - ' + pullReason.reason + '</div>').appendTo(menuWrapper);                             
            });
            $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper);
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
            var menuWrapper = $('#slip_pull_reason_id_dropdown .menu');
            $(menuWrapper).empty(); 
            $.each(data, function(i, pullReason) {
                slipPullReasonMap.set(pullReason.id, pullReason); // Keep reference of slip pull reasons for verify
                $('<div class="item" data-value="' + pullReason.id + '">' + pullReason.title + (pullReason.reason != null ? ' - ' + pullReason.reason : '') + '</div>').appendTo(menuWrapper);                    
            });
            $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper); 
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

function getExceptions() {
    $.post('../other_exception/list', function (data) {
        if (!data) {
            toastr.warning('The search did not match any exception.'); 
        } else {
            var menuWrapper = $('#exception_id_dropdown .menu');
            $(menuWrapper).empty();  
            $.each(data, function(i, exception) {
                exceptionMap.set(exception.id, exception); // Keep reference of other exception for verify
                $('<div class="item" data-value="' + exception.id + '">' + exception.title + '</div>').appendTo(menuWrapper);                             
            });
            $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper);
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });       
}

function getInstallmentMonths() {
    $.post('../installment_months/list', function (data) {
        if (!data) {
            toastr.warning('The search did not match any months.'); 
        } else {
            var menuWrapper = $('#installment_months_id_dropdown .menu');
            $(menuWrapper).empty();  
            $.each(data, function(i, month) {
                installMonthsMap.set(month.id, month); // Keep reference of installment months for verify
                $('<div class="item" data-value="' + month.id + '">' + month.title + '</div>').appendTo(menuWrapper);                             
            });
            $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper);
        }                
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });       
}