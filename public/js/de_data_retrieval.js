var withHeaderContent = false;
var withSlipContent = false;

var currencyMap;
var batchPullReasonMap;
var installMonthsMap;
var slipPullReasonMap;
var exceptionMap;

var rawHeaderMap; // <field_id, value>
var rawSlipMap; // <index, map<field_id, value>>  
function getRawContents() {  // Only called during Verify to get the previous task values e.g. Entry 1  

    var d = $.Deferred();

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
                var currency = currencyMapForRef.get(headerData['currency_id']);
                var currencyCode = currency ? currency.alpha_code : '';
                
                // If Other currency option is used.
                if (!currency && headerData['other_currency'].length > 0) currencyCode = headerData['other_currency'].toUpperCase();

                $.each(headerData, function(key, value) {
                    if (value && key.indexOf('amount') != -1) {                                                            
                        value = formatAmount(currencyCode, value);                                                
                    }

                    rawHeaderMap.set(key, value);                    
                });    
                
                applyHeaderChecks(); // See de_verify.js

                // Retrieve transactions.
                getSlips(headerData);   

                d.resolve(rawHeaderMap);
            }            
        })
    });

    // Retrieve related transactions.
    function getSlips(headerData) {

        var currency = currencyMapForRef.get(headerData['currency_id']);
        var currencyCode = currency ? currency.alpha_code : '';

        $.post('../transaction/getbyheader/' + headerData.id, function (data) {
            if (data || data.length > 0) {

                var currency = currencyMapForRef.get(rawHeaderMap.get('currency_id'));
                var currencyCode = currency ? currency.alpha_code : '';
                
                // If Other currency option is used.
                if (!currency && rawHeaderMap.get('other_currency').length > 0) currencyCode = rawHeaderMap.get('other_currency').toUpperCase();
                
                $.each(data, function(id, fieldValueArray) {
                    var slipValueMap = new HashMap();
                    var key;
                    $.each(fieldValueArray, function(id, value) {
                        if (id == 'sequence') {
                            key = value;                        
                        } else {
                            if (value && id.indexOf('card') != -1) {                                
                                slipValueMap.set(id, cc_format(value)); // See utils.js
                            } else if (value && id.indexOf('amount') != -1) {                                                                    
                                slipValueMap.set(id, formatAmount(currencyCode, value));
                            } else {
                                slipValueMap.set(id, value);
                            } 
                        }                    
                    });
                    rawSlipMap.set(parseInt(key), slipValueMap);
                });               
                  
                applySlipChecks(); // See de_verify.js
            }
        })
    }

    return d.promise();
}

function getLastCompleted(bastchId) {

    var deferred = $.Deferred();

    $.ajax({
        'url': '../data_entry/getbylastcompleted/' + bastchId,
        'success': function(data) {
            deferred.resolve(data);
        },
        'error': function(error) {
            deferred.reject(error);
        }
    });

    return deferred.promise();
}

function checkHeaderIfExists() { // Only executed on Balancing to help decide whether to use the previous entry id or the newly recorded task.
    var params = {};
    params.batch_id = $('#batch_id').val();
    params.data_entry_id = $('#data_entry_id').val();;    

    var d = $.Deferred();

    $.post('../merchant_header/get/', params, function (headerData) {
        d.resolve(headerData);
    });

    return d.promise();
}

function getContents(lastCompletedEntry, existingHeader) {    

    // Initialization of maps moved to de.js

    var dataEntryId = $('#data_entry_id').val();

    var params = {};
    params.batch_id = $('#batch_id').val();
    params.data_entry_id = dataEntryId;    

    // Auto load transaction type related fields. See de_data_navigation.js
    refreshTransTypeDependentFields();

    // For Balancing Only: Replace current activity ID to help fetch previous task's activity record.
    if (lastCompletedEntry && !existingHeader) {
        params.data_entry_id = lastCompletedEntry.id;            
    }

    $.when(getHeader(params))
    .done(function(headerData) {
        if (!headerData || headerData.length == 0) {
            //toastr.warning('This batch does not have any header content.');
        } else {
            withHeaderContent = true;
            $('#merchant_header_id').val(headerData.id);                                     
            //if (headerData.merchant_number) { !Editted for No MID handle
            if (headerData.id) {

                // Re-persist merchant information and filter dependent controls.
                if (headerData.merchant_number && headerData.merchant_number.trim().length > 0) getMerchantInfo(headerData.merchant_number);
                
                var currency = currencyMapForRef.get(headerData['currency_id']);
                var currencyCode = currency ? currency.alpha_code : '';
                                
                // Fill header fields with values.
                $.each(headerData, function(key, value) {
                    if (value && key.indexOf('amount') != -1) {                                                            
                        setFieldValue(key, formatAmount(currencyCode, value)); // See de_data_navigation.js
                    } else {
                        setFieldValue(key, value); // See de_data_navigation.js
                    }                    
                });
                
                // If Other currency option is used.
                if (!currency && (headerData['other_currency'] && headerData['other_currency'].length > 0)) currencyCode = headerData['other_currency'].toUpperCase(); 
                
                loadAndFormatAmounts(currencyCode);

                // Load transactions
                getSlipContents(headerData);

                // For Balancing Only: Revert back to current task's activity ID to correct saving of records.
                if (lastCompletedEntry) {
                    $('#data_entry_id').val(dataEntryId);
                } 
                
                calculateAmount(); // See util.js                
            }       
        }
    });
}

function getHeader(params) {
    var d = $.Deferred();    
    
    $.post('../merchant_header/get/', params, function (headerData) {   
        d.resolve(headerData);
    });

    return d.promise();
}

function getSlipContents(headerData) {

    var currency = currencyMapForRef.get(headerData['currency_id']);
    var currencyCode = currency ? currency.alpha_code : '';

    // If Other currency option is used.
    if (!currency && (headerData['other_currency'] && headerData['other_currency'].length > 0)) currencyCode = headerData['other_currency'].toUpperCase(); 

    $.post('../transaction/getbyheader/' + headerData.id, function (data) {
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
                        if (value && id.indexOf('card') != -1) {                                
                            slipValueMap.set(id, cc_format(value)); // See utils.js
                        } else if (value && id.indexOf('amount') != -1) {                                                            
                            slipValueMap.set(id, formatAmount(currencyCode, value));
                        } else {
                            slipValueMap.set(id, value);
                        }  
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
                $('.delete-slip-btn').removeClass('disabled'); 
            }                        
            
            // Refresh character counter.
            var counterEls = $('.charcount');
            $.each(counterEls, function(c, el) {
                var valueEL = $('#' + el.id.substring(0, el.id.lastIndexOf('_')));
                charsLeft(valueEL[0], valueEL.attr('allowedLength'));
            });

            // Compute total and variance. See de_data_navigation.js   
            calculateAmount();
        }                  
    })
    .done(function (msg) {
        refreshTransTypeDependentFields();
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}

var merchantAcceptedCards = [];
function getMerchantInfo(merchant_number) {
    var d = $.Deferred(); 

    $.post('../merchant/get/' + parseInt(merchant_number), function (merchantData) { 
        if (!merchantData) {
            toastr.info('The search did not match any merchant.');                    
            //Form.clear(true); !Editted for No MID handle
            $('#merchant_number').focus();
            $('#merchant_number').select();
        } else {
            // Reset merchant details map.
            merchantInfoMap.clear();
            
            // Persist merchant details in a map.
            $.each(merchantData, function(dbField, dbValue) {
                merchantInfoMap.set(dbField, dbValue);
            });

            $('#merchant_name').val(merchantData.doingBusinessAs);
            // Load currencies as can be filtered based on merchant's requirements
            //getRegionCurrency();
            Form.resetErrors(true);

            // Show tip if allows multiple currencies.
            if (merchantInfoMap.get('acceptOtherCurrency') == 'Y') {
                $('#multi_currency').html(' MULTI');
            } else {
                $('#multi_currency').html('');
            }

            // Perform merchant specific validations.
            var wrapper = $('#merchant_number_wrapper');
            var alert = $('#merchant_number_alert');
            if (merchantInfoMap.get('merchantStatus') !== 'O' && merchantInfoMap.get('merchantStatus') !== 'R') {
                $(alert).remove();
                $(wrapper).addClass('error');
                $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="merchant_number_alert">' +
                        '<span id="merchant_number_msg">Invalid Merchant: In ' + merchantInfoMap.get('merchantStatus') + ' Status</span>' +
                        '</div>');
                $('#merchant_number').select(); 
                //toastr.info($('#merchant_name').val() + ' is an Invalid Merchant!');   
            } else {
                $(alert).remove();
                $(wrapper).removeClass('error');
            }
            
            if (merchantInfoMap.get('stateCountry') != $('#region_code').val()) {
                $(alert).remove();
                $(wrapper).addClass('error');
                $(wrapper).append('<div class="ui basic red pointing prompt label transition" id="merchant_number_alert">' +
                        '<span id="merchant_number_msg">Merchant is out of Region (' + merchantInfoMap.get('stateCountry') + ')</span>' +
                        '</div>');
                $('#merchant_number').select();
            } else {
                $(alert).remove();
                $(wrapper).removeClass('error');
            }

            if (merchantInfoMap.get('acceptInstallment') != 'N') {
                $('#installment_months_id_wrapper').removeClass('hidden');
            } else {
                $('#installment_months_id_wrapper').addClass('hidden');
                $('#other_inst_term_wrapper').addClass('hidden');
            }

            if (merchantInfoMap.get('acceptAmex') == 'Y') {
                merchantAcceptedCards.push('AMEX');
            }
            
            if (merchantInfoMap.get('acceptCup') == 'Y') {
                merchantAcceptedCards.push('CUP');
            }

            if (merchantInfoMap.get('acceptJcb') == 'Y') {
                merchantAcceptedCards.push('JCB');
            }

            if (merchantInfoMap.get('acceptMasterCard') == 'Y') {
                merchantAcceptedCards.push('Mastercard');
            }

            if (merchantInfoMap.get('acceptPrivateLabel') == 'Y') {
                merchantAcceptedCards.push('PrivateLabel');
            }

            if (merchantInfoMap.get('acceptVisa') == 'Y') {
                merchantAcceptedCards.push('Visa');
            }

            if (merchantInfoMap.get('acceptDiscover') == 'Y') {
                merchantAcceptedCards.push('Discover');
            }
        }
        d.resolve(merchantData);
    });

    return d.promise();
}

function getRegionCurrencyForRef() {
    var d = $.Deferred();

    $.post('../currency/getbyregion/' + $('#region_code').val(), function (data) {
        if (!data) {
            toastr.warning('The search did not match any currency.'); 
        } else {
            $.each(data, function(i, currency) {
                currencyMapForRef.set(currency.id, currency); // Keep reference of currencies for verify
            });                        
        }   
        d.resolve(data);             
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });    

    return d.promise();
}

function getRegionCurrency() {
    var d = $.Deferred();

    $.post('../currency/getbyregion/' + $('#region_code').val(), function (data) {
        if (!data) {
            toastr.warning('The search did not match any currency.'); 
        } else {
            var menuWrapper = $('#currency_id_dropdown .menu');
            $(menuWrapper).empty();
            $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper); 
            $.each(data, function(i, currency) {
                currencyMap.set(currency.id, currency); // Keep reference of currencies for verify
                $('<div class="item" data-value="' + currency.id + '">' + currency.alpha_code + ' (' + currency.num_code + ')</div>').appendTo(menuWrapper);
            });
            if (merchantInfoMap.get('acceptOtherCurrency') == 'Y') {
                $('<div class="item" data-value="34">Other</div>').appendTo(menuWrapper);              
            }            
        }   
        d.resolve(data);             
    })
    .done(function (msg) {
        // Do nothing...
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });    

    return d.promise();
}

function getPullReasons() {
    // Retrieve all reasons for pulling a batch.
    $.post('../pull_reason/getbylevel/Batch', function (data) {
        if (!data) {
            toastr.warning('The search did not match any pull reason.'); 
        } else {
            var menuWrapper = $('#batch_pull_reason_id_dropdown .menu');
            $(menuWrapper).empty();  
            $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper);
            $.each(data, function(i, pullReason) {
                batchPullReasonMap.set(pullReason.id, pullReason); // Keep reference of bath pull reasons for verify
                $('<div class="item" data-value="' + pullReason.id + '">' + pullReason.on_display + '</div>').appendTo(menuWrapper);                             
            });            
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
            $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper); 
            $.each(data, function(i, pullReason) {
                slipPullReasonMap.set(pullReason.id, pullReason); // Keep reference of slip pull reasons for verify
                $('<div class="item" data-value="' + pullReason.id + '">' + pullReason.on_display + '</div>').appendTo(menuWrapper);                    
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

function getExceptions() {
    $.post('../other_exception/list', function (data) {
        if (!data) {
            toastr.warning('The search did not match any exception.'); 
        } else {
            var menuWrapper = $('#exception_id_dropdown .menu');
            $(menuWrapper).empty();  
            $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper);
            $.each(data, function(i, exception) {
                exceptionMap.set(exception.id, exception); // Keep reference of other exception for verify
                $('<div class="item" data-value="' + exception.id + '">' + exception.title + '</div>').appendTo(menuWrapper);                             
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

function getInstallmentMonths() {
    $.post('../installment_months/list', function (data) {
        if (!data) {
            toastr.warning('The search did not match any months.'); 
        } else {
            var menuWrapper = $('#installment_months_id_dropdown .menu');
            $(menuWrapper).empty();  
            $('<div class="item" data-value="0">- None -</div>').appendTo(menuWrapper);
            $.each(data, function(i, month) {
                installMonthsMap.set(month.id, month); // Keep reference of installment months for verify
                $('<div class="item" data-value="' + month.id + '">' + month.on_display + '</div>').appendTo(menuWrapper);                             
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

function getPrevOperator() {
    var params = {};
    params.batch_id = $('#batch_id').val();
    params.task_id = $('#session_task_id').val();
    $.post('../batch/getprevoperator', params, function (data) {            
        if (data) {
            //$('.prev-operator').removeClass('hidden');
            $('.prev-operator').html('DE Optr: ' + data.first_name + ' ' + data.last_name);            
        }                
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    }); 
}

function getKeyer() {
    var d = $.Deferred();
    
    $.post('../batch/getkeyer/' + $('#batch_id').val(), function (data) {            
        if (data) {
            $('.prev-operator').removeClass('hidden');
            $('.prev-operator').append('<a class="ui tag label">Keyer: ' + data.first_name + '</a> ');            
        }   
        d.resolve(data);             
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    }); 
    
    return d.promise();
}

function getVerifier() {
    var d = $.Deferred();

    $.post('../batch/getverifier/' + $('#batch_id').val(), function (data) {            
        if (data) {
            $('.prev-operator').removeClass('hidden');
            $('.prev-operator').append('<a class="ui tag label">Verifier: ' + data.first_name + '</a> ');  
        }              
        d.resolve(data);            
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    }); 

    return d.promise();
}

function getBalancer() {
    var d = $.Deferred();

    $.post('../batch/getbalancer/' + $('#batch_id').val(), function (data) {            
        if (data) {
            $('.prev-operator').removeClass('hidden');
            $('.prev-operator').append('<a class="ui tag label">Balancer: ' + data.first_name + '</a>');  
        }            
        d.resolve(data);      
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    }); 

    return d.promise();
}