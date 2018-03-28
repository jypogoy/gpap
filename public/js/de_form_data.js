function saveSlip() {
    var slipValueMap = new HashMap();
    var slipFields = $('.slip-field');    
    $.each(slipFields, function(i, field) {
        if($(field).is(':checkbox')) {
           slipValueMap.set(field.id, $(field).prop('checked'));
        } else {
           slipValueMap.set(field.id, field.value);
        }        
    });        
    slipMap.set(slipPage, slipValueMap);
}

function navigateToNextSlip() {           
        
    if (Form.validate(false)) {
    
        saveSlip();    
    
        if (slipPage <= slipMap.count()) slipPage++;      
        if (slipPage == slipMap.count()) $('.next-slip-btn').addClass('disabled'); 

        var slipValueMap = slipMap.get(slipPage);
        if (slipValueMap) {
            slipValueMap.forEach(function(value, key) {            
                if($('#' + key).is(':checkbox')) {
                    if (value == true) {
                        $('#' + key).prop('checked', true);
                    } else {
                        $('#' + key).prop('checked', false);
                    }
                } else {
                    $('#' + key).val(value);   
                }           
                var parent = $('#' + key).parent();
                if (parent.hasClass('dropdown')) {
                    if (value == '') {
                        parent.dropdown('restore defaults');
                    } else {
                        parent.dropdown('set selected', value);
                    }                
                }            
            });
            $('.delete-slip-btn').removeClass('disabled');
        } else {
            Form.clear(false)();
            $('.delete-slip-btn').addClass('disabled');      
            //if (slipPage < (slipMap.count() + 1)) navigateToNextSlip(); // Loop until the next slip is found after delete     
        }    
        
        $('#currentSlipPage').html(slipPage);
        $('.prev-slip-btn').removeClass('disabled');     
        refreshTransTypeDependentFields();     
    }
}

function navigateToPrevSlip() {   
    
    if (Form.validate(false)) {
   
        saveSlip();    

        if (slipPage > 1) slipPage--;
        if (slipPage == 1) $('.prev-slip-btn').addClass('disabled'); 

        var slipValueMap = slipMap.get(slipPage);
        if (slipValueMap) {
            slipValueMap.forEach(function(value, key) {
                if($('#' + key).is(':checkbox')) {
                    if (value == true) {
                        $('#' + key).prop('checked', true);
                    } else {
                        $('#' + key).prop('checked', false);
                    }
                } else {
                    $('#' + key).val(value);   
                } 
                var parent = $('#' + key).parent();
                if (parent.hasClass('dropdown')) {
                    if (value == '') {
                        parent.dropdown('restore defaults');
                    } else {
                        parent.dropdown('set selected', value);
                    }  
                }
            });
            $('.delete-slip-btn').removeClass('disabled');
        } else {
            Form.clear(false)();
            $('.delete-slip-btn').addClass('disabled');
            if (slipPage < (slipMap.count() + 1)) navigateToNextSlip(); // Loop until the next slip is found after delete    
        }
        
        $('#currentSlipPage').html(slipPage);
        $('.next-slip-btn').removeClass('disabled');
        refreshTransTypeDependentFields();
    }
} 

function refreshTransTypeDependentFields() {
    var option = $('#transaction_type_dropdown').dropdown('get text');
    if (option.indexOf('Airline') != -1) {
        $('#other_fields_div').removeClass('hidden');
        $('.airline-field').parent().removeClass('hidden');
        $('.vi-field').parent().addClass('hidden');
    } else if (option.indexOf('VI') != -1) {
        $('#other_fields_div').removeClass('hidden');
        $('.vi-field').parent().removeClass('hidden');
        $('.airline-field').parent().addClass('hidden');
    } else {
        $('#other_fields_div').addClass('hidden');
        $('.airline-field').parent().addClass('hidden');
        $('.vi-field').parent().addClass('hidden');
    }
}

function searchMerchant($merchantNumber) {
    $.post('../merchant/get/' + $merchantNumber, function (data) {
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

function getCurrencies($regionCode) {
    $.post('../currency/getbyregion/' + $regionCode, function (data) {
        if (!data) {
            toastr.warning('The search did not match any currency.'); 
        } else {
            var menuWrapper = $('#currency_code_dropdown .menu');
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
            var menuWrapper = $('#transaction_type_dropdown .menu');
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
            var menuWrapper = $('#batch_pull_reason_dropdown .menu');
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
            var menuWrapper = $('#slip_pull_reason_dropdown .menu');
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
    $.post('../otherexception/list', function (data) {
        if (!data) {
            toastr.warning('The search did not match any exception.'); 
        } else {
            var menuWrapper = $('#other_exception_dropdown .menu');
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
    $.post('../installmentmonths/list', function (data) {
        if (!data) {
            toastr.warning('The search did not match any months.'); 
        } else {
            var menuWrapper = $('#installment_months_dropdown .menu');
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

function gatherHeaderValues() {
    var fields = $('.header-field');
    var data = {};
    data.batch_id = $('#batchId').val();
    $.each(fields, function(i, field) {        
        if (field.id.indexOf('date') != -1) {
            data[field.id] = $.datepicker.formatDate('yy-mm-dd', new Date(field.value));
        } else {
            data[field.id] = field.value;
        }
    });
    return data;
}

function saveBatch(isSaveNew) {
   
    saveSlip(); // Save the current content
   
    $.post('../merchant_header/save', gatherHeaderValues(), function (headerId) {
        if($.isNumeric(headerId)) { // Check if the newly created header id was created.
            slipMap.forEach(function(fieldValueMap, index) {
                
                var data = {};
                data['merchant_header_id'] = headerId;
                data['sequence'] = index;
                fieldValueMap.forEach(function(value, id) {
                    console.log(id + ' : ' + value)
                    if (id.indexOf('date') != -1) {
                        data[id] = $.datepicker.formatDate('yy-mm-dd', new Date(value));
                    } else {
                        data[id] = value;
                    }      
                });

                $.post('../transaction/save', data, function (msg) {
                    if (msg.indexOf('success')) {
                        toastr.success(msg);    
                    } else {
                        toastr.error(msg);
                    }
                })
                .done(function (msg) {
                    // Do nothing...
                })
                .fail(function (xhr, status, error) {
                    toastr.error(error);
                });
            });
        } else {
            toastr.error(headerId);
        }
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

function completeBatch(isCompleteNew) {

}