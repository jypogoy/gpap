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

function validateCard(value) { // Luhn algorithm or MOD 10
    // accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(value)) return false;

    // The Luhn Algorithm. It's so pretty.
    var nCheck = 0, nDigit = 0, bEven = false;
    value = value.replace(/\D/g, "");

    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n),
          nDigit = parseInt(cDigit, 10);

      if (bEven) {
        if ((nDigit *= 2) > 9) nDigit -= 9;
      }

      nCheck += nDigit;
      bEven = !bEven;
    }

    return (nCheck % 10) == 0;
}

function limitCardLengthByStartingNumbers(el) {
    var number = el.value;
    // Supported starting numbers
    re = new RegExp("^(3|4|9|51|52|53|54|55|2131|1800|589460)");
    if (number.match(re) != null) {
        re = new RegExp("^(3|4|9|51|52|53|54|55|589460)");
        if (number.match(re) != null) $(el).attr('maxlength', 16);
        re = new RegExp("^(2131|1800)");
        if (number.match(re) != null) $(el).attr('maxlength', 15);
    }
}

function withinCardCollection(value) {
    // Supported starting numbers
    re = new RegExp("^(3|4|9|51|52|53|54|55|2131|1800|589460)");
    return value.match(re) != null ? true : false;
}

function getCardType(number)
{
    // Visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
        return "Visa";

    // Mastercard 
    // Updated for Mastercard 2017 BINs expansion
     if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)) 
        return "Mastercard";

    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null)
        return "AMEX";

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null)
        return "Discover";

    // Diners
    re = new RegExp("^36");
    if (number.match(re) != null)
        return "Diners";

    // Diners - Carte Blanche
    re = new RegExp("^30[0-5]");
    if (number.match(re) != null)
        return "Diners - Carte Blanche";

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (number.match(re) != null)
        return "JCB";

    // Visa Electron
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (number.match(re) != null)
        return "Visa Electron";

    // China Union Pay
    re = new RegExp("^(62[0-9]{14,17})$");
    if (number.match(re) != null)
        return "CUP";

    // Maestro
    re = new RegExp("^(5018)");
    if (number.match(re) != null)
        return "Maestro";

    // Not supported starting numbers
    re = new RegExp("^(3|4|9|51|52|53|54|55|2131|1800|589460)");
    if (number.match(re) == null)
        return "NotSupported";

    return "";
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
        if (otherCurrCode.indexOf('JPY') != -1 || otherCurrCode.indexOf('KRW') != -1 || otherCurrCode.indexOf('IDR') != -1 
            || ($('#region_code').val() == 'MY' && otherCurrCode.indexOf('TWD') != -1)) {
            currNoDecimal = true;                
        } else {
            currNoDecimal = false;
        }            
    } else {
        if (currencyCode.indexOf('JPY') != -1 || currencyCode.indexOf('KRW') != -1 || currencyCode.indexOf('IDR') != -1 
            || ($('#region_code').val() == 'MY' && currencyCode.indexOf('TWD') != -1)) {
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
            } else {
                amountValue = accounting.formatMoney(amountValue, { symbol: '', format: '%v %s' }); // See accounting.min.js
            }
        } else {                    
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
        currencyCode = $('#currency_id_dropdown').dropdown('get text');   

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

function calculateAmount() {

    var currencyCode = $('#currency_id_dropdown').dropdown('get text');  

    var totalAmount = 0;
    slipMap.forEach(function(valueMap, page) {
        valueMap.forEach(function(value, fieldId) {
            if (fieldId.indexOf('amount') != -1 && value && value != '0') {
                value = unformatValue(value); 
                totalAmount = Number(totalAmount) + Number(value);
            }
        });
    });
       
    var deposit = unformatValue($('#deposit_amount').val()); // See utils.js    
    var variance = totalAmount - deposit;
    
    $('#total_transaction_amount').val(formatAmount(currencyCode, String(totalAmount)));    
    $('#variance').val(formatAmount(currencyCode, String(variance)));
};

// function loadAndFormatAmounts_OLD() {
//     // Check if selected is either JPY, KRW or IDR that restricts decimal in amounts.
//     var amountFields = $('input[id*="amount"]');
//     var text = $('#currency_id_dropdown').dropdown('get text');   
//     //if (text.indexOf('Choose') == -1) {    
//         if (text.indexOf('Other') != -1) {
//             var otherCurrCode = $('#other_currency').val().toUpperCase();
//             if (otherCurrCode.indexOf('JPY') != -1 || otherCurrCode.indexOf('KRW') != -1 || otherCurrCode.indexOf('IDR') != -1 
//                 || ($('#region_code').val() == 'MY' && otherCurrCode.indexOf('TWD') != -1)) {
//                 currNoDecimal = true;                
//             } else {
//                 currNoDecimal = false;
//             }            
//         } else {
//             if (text.indexOf('JPY') != -1 || text.indexOf('KRW') != -1 || text.indexOf('IDR') != -1 
//                 || ($('#region_code').val() == 'MY' && text.indexOf('TWD') != -1)) {
//                 currNoDecimal = true;                
//             } else {
//                 currNoDecimal = false;
//             }
//         }

//         $.each(amountFields, function(i, field) {
//             if (currNoDecimal) {
//                 var wholeValue = field.value.indexOf('.') != -1 ? field.value.substring(0, field.value.indexOf('.')) : field.value; // Remove the decimal value
//                 var noDecVal = noDecimal(wholeValue); // See utils.js
//                 field.value = accounting.formatNumber(noDecVal); // See accounting.min.js            
//             } else {
//                 if (text.indexOf('Other') != -1) {                    
//                     var otherCurrCode = $('#other_currency').val().toUpperCase();
//                     if (otherCurrCode.indexOf('BHD') != -1 || otherCurrCode.indexOf('KWD') != -1 || otherCurrCode.indexOf('OMR') != -1) {
//                         field.value = accounting.formatMoney(field.value, { symbol: '', precision: 3, format: '%v %s' }); // See accounting.min.js
//                     } else {
//                         field.value = accounting.formatMoney(field.value, { symbol: '', format: '%v %s' }); // See accounting.min.js
//                     }
//                 } else {                    
//                     if (text.indexOf('BHD') != -1 || text.indexOf('KWD') != -1 || text.indexOf('OMR') != -1) {
//                         field.value = accounting.formatMoney(field.value, { symbol: '', precision: 3, format: '%v %s' }); // See accounting.min.js
//                     } else {
//                         field.value = accounting.formatMoney(field.value, { symbol: '', format: '%v %s' }); // See accounting.min.js
//                     }
//                 }
//             }
//         }); 
//     //}
    
//     var varianceField =  $('#variance');
//     if (currNoDecimal) {
//         var wholeValue = varianceField.val().indexOf('.') != -1 ? varianceField.val().substring(0, varianceField.val().indexOf('.')) : varianceField.val(); // Remove the decimal value
//         var noDecVal = noDecimal(wholeValue); // See utils.js
//         varianceField.val(accounting.formatNumber(noDecVal)); // See accounting.min.js            
//     } else {
//         if (text.indexOf('Other') != -1) {
//             var otherCurrCode = $('#other_currency').val().toUpperCase();
//             if (otherCurrCode.indexOf('BHD') != -1 || otherCurrCode.indexOf('KWD') != -1 || otherCurrCode.indexOf('OMR') != -1) {
//                 varianceField.val(accounting.formatMoney(varianceField.val(), { symbol: '', precision: 3, format: '%v %s' })); // See accounting.min.js
//             } else {
//                 varianceField.val(accounting.formatMoney(varianceField.val(), { symbol: '', format: '%v %s' })); // See accounting.min.js
//             }
//         } else {
//             if (text.indexOf('BHD') != -1 || text.indexOf('KWD') != -1 || text.indexOf('OMR') != -1) {
//                 varianceField.val(accounting.formatMoney(varianceField.val(), { symbol: '', precision: 3, format: '%v %s' })); // See accounting.min.js
//             } else {
//                 varianceField.val(accounting.formatMoney(varianceField.val(), { symbol: '', format: '%v %s' })); // See accounting.min.js
//             }
//         }
//     }
// }