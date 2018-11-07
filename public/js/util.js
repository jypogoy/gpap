function cc_format(value) {
    var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    var matches = v.match(/\d{4,16}/g);
    var match = matches && matches[0] || ''
    var parts = []

    for (i=0, len=match.length; i<len; i+=4) {
        parts.push(match.substring(i, i+4))
    }

    if (parts.length) {
        return parts.join(' ')
    } else {
        return value
    }
}

function padZero(el) {
    el.val(new Array(el.attr('maxlength') - el.val().toString().length + 1).join('0') + el.val());
}

function toCurrency(el) {
    el.val(parseFloat(Math.round(el.val() * 100) / 100).toFixed(2));
}

function unformat(el) {
    el.value = el.value.replace(/[^0-9.]/g, '');
}

function unformatValue(value) {
   return value.replace(/[^0-9.]/g, '');
}

function noDecimal(value) {
    return value.replace(/[.]/g, '');
 }

function numToCurrency(value) {
    return parseFloat(Math.round(value * 100) / 100).toFixed(2);
}

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    if ("withCredentials" in xhr) {
      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);    
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');  
    } else if (typeof XDomainRequest != "undefined") {
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // Otherwise, CORS is not supported by the browser.
      xhr = null;
    }
    return xhr;
}

function getLengthByCard(card) {
    var lengths = [];
    switch (card) {
        case "Visa":
            lengths.push(13);
            lengths.push(16);
            break;

        case "Visa Electron":
            lengths.push(13);
            lengths.push(16);
            break;    

        case "Mastercard":
            lengths.push(16);
            break;    
        
        case "AMEX":
            lengths.push(16);
            break;     

        case "Discover":
            lengths.push(16);
            break;
        
        case "Diners":
            lengths.push(16);   
            break;  

        case "Diners - Carte Blanche":
            lengths.push(16);
            break;    

        case "JCB":
            
            break;                     
            
        case "CUP":
            
            break; 
            
        case "Maestro":
            
            break;     

        default:
            break;
    }
}

function checkWebStorageSupport() {
  if (typeof(Storage) !== "undefined") {
      // Code for localStorage/sessionStorage.
      return true;
  } else {
      // Sorry! No Web Storage support..
      return false;
  }
}

function formatDate(date) {
    var day = new Array(2 - date.getDate().toString().length + 1).join('0') + date.getDate();            
    var month = new Array(2 - (date.getMonth() + 1).toString().length + 1).join('0') + (date.getMonth() + 1);
    var year = date.getFullYear().toString().substr(-2);
    return month + '/' + day + '/' + year;
}

function charsLeft(el, total) {
    var diff = total - el.value.length;
    $('#' + el.id + '_counter').html(diff + (diff > 1 ? ' chars' : ' char') + ' left.');
}

function toAlphaNumNoSpace(el) {
    el.value = el.value.replace(/[^a-zA-Z0-9]/g, '');
}

function toNum(el) {
    el.value = el.value.replace(/[^0-9]/g, '');
}

function formatAmount(currencyCode, amountValue) {
    if (currencyCode.indexOf('Other') != -1) {
        var otherCurrCode = $('#other_currency').val().toUpperCase();
        //|| ($('#region_code').val() == 'MY' && otherCurrCode.indexOf('TWD') != -1)
        if (otherCurrCode.indexOf('JPY') != -1 || otherCurrCode.indexOf('KRW') != -1) {
            currNoDecimal = true;                
        } else {
            currNoDecimal = false;
        }            
    } else {
        //|| ($('#region_code').val() == 'MY' && currencyCode.indexOf('TWD') != -1)
        if (currencyCode.indexOf('JPY') != -1 || currencyCode.indexOf('KRW') != -1) {
            currNoDecimal = true;
        } else {
            currNoDecimal = false;
        }
    }
    
    if (currNoDecimal) {
        var wholeValue = amountValue.indexOf('.') != -1 ? amountValue.substring(0, amountValue.indexOf('.')) : amountValue; // Remove the decimal value
        var noDecVal = noDecimal(wholeValue); // See utils.js
        amountValue = accounting.formatNumber(noDecVal); // See accounting.min.js            
    } else {
        if (currencyCode.indexOf('Other') != -1) {                    
            var otherCurrCode = $('#other_currency').val().toUpperCase();
            if (otherCurrCode.indexOf('BHD') != -1 || otherCurrCode.indexOf('KWD') != -1 || otherCurrCode.indexOf('OMR') != -1) {
                amountValue = accounting.formatMoney(amountValue, { symbol: '', precision: 3, format: '%v %s' }); // See accounting.min.js
                //amountValue = accounting.formatMoney(amountValue, 3, ','); // See accounting.min.js
            } else {
                amountValue = accounting.formatMoney(amountValue, { symbol: '', format: '%v %s' }); // See accounting.min.js
            }
        } else {
            currencyCode = currencyCode.toUpperCase();                    
            if (currencyCode.indexOf('BHD') != -1 || currencyCode.indexOf('KWD') != -1 || currencyCode.indexOf('OMR') != -1) {
                amountValue = accounting.formatMoney(amountValue, { symbol: '', precision: 3, format: '%v %s' }); // See accounting.min.js
            } else {
                amountValue = accounting.formatMoney(amountValue, { symbol: '', format: '%v %s' }); // See accounting.min.js
            }
        }
    } 
    return amountValue;
}

function loadAndFormatAmounts(currencyCode) {
    // Apply formatting to displayed amount form fields.
    var amountFields = $('input[id*="amount"]');
    if (!currencyCode) {
        currencyCode = $('#currency_id_dropdown').dropdown('get text').substring(0, 3);

        // Use the keyed currency code if Other option is selected.
        if (currencyCode == 'Other') currencyCode = $('#other_currency').val().toUpperCase();
    }

    $.each(amountFields, function(i, field) {
        field.value = formatAmount(currencyCode, field.value);
    });

    // Apply formatting to the variance field.
    var varianceField =  $('#variance');
    varianceField.val(formatAmount(currencyCode, varianceField.val()));

    // Apply formatting to the entire slip map. Retrieve the amount, format, then set back to the map.
    slipMap.forEach(function(slipValueMap, index) {
        slipValueMap.forEach(function(value, key) {
            if (key.indexOf('amount') != -1) {
                slipValueMap.set(key, formatAmount(currencyCode, value));
            }
        });
        slipMap.set(index, slipValueMap);
    });
}

function calculateAmount(currencyCode) {

    var currencyCode = currencyCode ? 
                        (currencyCode == 'Other' ? $('#other_currency').val() : currencyCode) : 
                        $('#currency_id_dropdown').dropdown('get text').substring(0, 3);

    var totalAmount = new Decimal(0);
    slipMap.forEach(function(valueMap, page) {
        valueMap.forEach(function(value, fieldId) {
            if (fieldId.indexOf('amount') != -1 && value && value != '0') {      
                value = unformatValue(value);
                totalAmount = totalAmount.plus(value);
                //totalAmount = Math.round((parseFloat(totalAmount) + parseFloat(value)) * 1e12) / 1e12;
            }
        });
    });

    var deposit = unformatValue($('#deposit_amount').val()); // See utils.js    
    var variance = totalAmount.minus(deposit);
    //var variance = totalAmount - deposit;
    $('#total_transaction_amount').val(formatAmount(currencyCode, String(totalAmount)));    
    $('#variance').val(formatAmount(currencyCode, String(variance)));
};
function findSlipValueMatch(key, value) {
    var exists = false;
    slipMap.forEach(function(valueMap, page) {
        valueMap.forEach(function(fieldValue, fieldId) {
            if (fieldId == key && fieldValue == value && parseInt(page) != parseInt(slipPage)) {      
                exists = true;
            }
        });
    });
    return exists;
}

function checkSlipValueIfNotSame(page, key, value) {
    var differs = false;
    var slipValueMap = slipMap.get(page);
    if (slipValueMap) {
        var recValue = slipValueMap.get(key);
        if (recValue && recValue.length > 0 && recValue !== value) {
            differs = true;
        }
    }
    return differs;
}