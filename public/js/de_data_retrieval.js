var withHeaderContent = false;
var withSlipContent = false;

function getContents() {
    $.post('../merchant_header/getbybatch/' + $('#batch_id').val(), function (headerData) {
        if (!headerData || headerData.length == 0) {
            //toastr.warning('This batch does not have any header content.');
        } else {
            withHeaderContent = true;
            $('#merchant_header_id').val(headerData.id);
            
            // Load information of dependent fields e.g. currency
            // Get the region or country code.
            $.post('../merchant/get/' + parseInt(headerData.merchant_number), function (merchantData) {   
                // Get all currencies with the region.
                $.post('../currency/getbyregion/' + merchantData.country_code, function (data) {   
                  
                    // Populate currencies allowed by the recorded merchant.            
                    var menuWrapper = $('#currency_id_dropdown .menu');
                    $(menuWrapper).empty();
                    $.each(data, function(i, currency) {
                        $('<div class="item" data-value="' + currency.id + '">' + currency.num_code + ' (' + currency.alpha_code + ')</div>').appendTo(menuWrapper);
                    });
                    $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper); 

                    // Reinstantiate the currency dropdown to apply changes. See de_form_events.js for similar code                
                    $('#currency_id_dropdown').dropdown({
                        onChange: function() {
                            var value = $(this).dropdown('get value');            
                            if (value > 0) {
                                if (this.value != '') $('#currency_id_wrapper').removeClass('error');
                            } else {
                                $(this).dropdown('restore defaults');
                            }
                        }
                    });

                    // Fill header fields with values.
                    $.each(headerData, function(key, value) {
                        setFieldValue(key, value); // See de_data_navigation.js
                    });
        
                    // Load transactions
                    getSlipContents(headerData.id);         
                })

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
        // Do nothing...
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
            $('#merchant_name').val(data.dba_name);
            //$('#regionCode').val(data.country_code);
            getCurrencies(data.country_code);
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
                $('<div class="item" data-value="' + currency.id + '">' + currency.num_code + ' (' + currency.alpha_code + ')</div>').appendTo(menuWrapper);
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

function getTransactionTypes() {
    $.post('../transaction_type/list', function (data) {
        if (!data) {
            toastr.warning('The search did not match any transaction type.'); 
        } else {
            var menuWrapper = $('#transaction_type_id_dropdown .menu');
            $(menuWrapper).empty();
            $.each(data, function(i, transType) {
                $('<div class="item" data-value="' + transType.id + '">' + transType.type + '</div>').appendTo(menuWrapper);
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

function getPullReasons() {
    // Retrieve all reasons for pulling a batch.
    $.post('../pull_reason/getbylevel/Batch', function (data) {
        if (!data) {
            toastr.warning('The search did not match any pull reason.'); 
        } else {
            var menuWrapper = $('#batch_pull_reason_id_dropdown .menu');
            $(menuWrapper).empty();  
            $.each(data, function(i, pullReason) {
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