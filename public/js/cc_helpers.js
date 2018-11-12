function withinCardCollection(value) {
    // Supported starting numbers
    re = new RegExp("^(3|4|6|9|51|52|53|54|55|2131|1800|589460)|^(222[1-8][0-9]{2}|2229[0-8][0-9]|22299[0-9]|22[3-9][0-9]{3}|2[3-6][0-9]{4}|27[01][0-9]{3}|2720[0-8][0-9]|27209[0-9])");
    return value.match(re) != null ? true : false;
}

function getCardType(number)
{    
    // Visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
        return "Visa";

    // Visa Electron
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (number.match(re) != null)
        return "Visa Electron";

    // Mastercard 
    // Updated for Mastercard 2017 BINs expansion
     if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)) 
        return "Mastercard";

    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null)
        return "AMEX";

    // Discover -------------------------------------------------------------------------------------------------------------
    // re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    // if (number.match(re) != null)
    //     return "Discover";

    // 60110000 - 60110399 (16 or 19 in length)
    re = new RegExp("^(60110[0-2][0-9]{2}|601103[0-8][0-9]|6011039[0-9])");
    if (number.match(re) != null)
        return "Discover";

    // 60110400 - 60110499 (16 or 19 in length)
    re = new RegExp("^(601104[0-8][0-9]|6011049[0-9])");
    if (number.match(re) != null)
        return "Discover";

    // 60110500 - 60110999 (16 or 19 in length)
    re = new RegExp("^(60110[5-8][0-9]{2}|601109[0-8][0-9]|6011099[0-9])");
    if (number.match(re) != null)
        return "Discover";

    // 60112000 - 60114999 (16 or 19 in length)
    re = new RegExp("^(6011[23][0-9]{3}|60114[0-8][0-9]{2}|601149[0-8][0-9]|6011499[0-9])");
    if (number.match(re) != null)
        return "Discover";

    // 60117400 - 60117499 (16 or 19 in length)
    re = new RegExp("^(601174[0-8][0-9]|6011749[0-9])");
    if (number.match(re) != null)
        return "Discover";

    // 60117700 - 60117999 (16 or 19 in length)
    re = new RegExp("^(60117[78][0-9]{2}|601179[0-8][0-9]|6011799[0-9])");
    if (number.match(re) != null)
        return "Discover";

    // 60118600 - 60119999 (16 or 19 in length)
    re = new RegExp("^(60118[6-8][0-9]{2}|601189[0-8][0-9]|6011899[0-9]|60119[0-9]{3})");
    if (number.match(re) != null)
        return "Discover";

    // 64400000 - 65059999 (16 or 19 in length)
    re = new RegExp("^(64[4-8][0-9]{5}|649[0-8][0-9]{4}|6499[0-8][0-9]{3}|64999[0-8][0-9]{2}|649999[0-8][0-9]|6499999[0-9]|650[0-4][0-9]{4}|6505[0-8][0-9]{3}|65059[0-8][0-9]{2}|650599[0-8][0-9]|6505999[0-9])");
    if (number.match(re) != null)
        return "Discover";

    // 65060000 - 65060099 (16 or 19 in length)
    re = new RegExp("^(650600[0-8][0-9]|6506009[0-9])");
    if (number.match(re) != null)
        return "Discover";
        
    // 65060000 - 65060099 (16 or 19 in length)
    re = new RegExp("^(65060[1-8][0-9]{2}|650609[0-8][0-9]|6506099[0-9])");
    if (number.match(re) != null)
        return "Discover";    

    // 65061000 - 65061099 (16 or 19 in length)
    re = new RegExp("^(650610[0-8][0-9]|6506109[0-9])");
    if (number.match(re) != null)
        return "Discover";

    // 65061100 - 65999999 (16 or 19 in length)
    re = new RegExp("^(65061[1-8][0-9]{2}|650619[0-8][0-9]|6506199[0-9]|6506[2-9][0-9]{3}|650[7-9][0-9]{4}|65[1-9][0-9]{5})");
    if (number.match(re) != null)
        return "Discover";

    // Discover End ---------------------------------------------------------------------------------------------------------    

    // Diners ----------------------------------------------------------------------------------------------------------------
    // re = new RegExp("^36");
    // if (number.match(re) != null)
    //     return "Diners";

    // 30000000 - 30599999 (16 or 19 in length)
    re = new RegExp("^(30[0-4][0-9]{5}|305[0-8][0-9]{4}|3059[0-8][0-9]{3}|30599[0-8][0-9]{2}|305999[0-8][0-9]|3059999[0-9])");
    if (number.match(re) != null)
        return "Diners-1";    

    // 30950000 - 30959999 (16 or 19 in length)
    re = new RegExp("^(3095[0-8][0-9]{3}|30959[0-8][0-9]{2}|309599[0-8][0-9]|3095999[0-9])");
    if (number.match(re) != null)
        return "Diners-1";    

    // 36000000 - 36999999 (14 or 19 in length)
    re = new RegExp("^(36[0-8][0-9]{5}|369[0-8][0-9]{4}|3699[0-8][0-9]{3}|36999[0-8][0-9]{2}|369999[0-8][0-9]|3699999[0-9])");
    if (number.match(re) != null)
        return "Diners-2";    

    // 38000000 - 39999999 (16 or 19 in length)
    re = new RegExp("^(38[0-9]{6}|39[0-8][0-9]{5}|399[0-8][0-9]{4}|3999[0-8][0-9]{3}|39999[0-8][0-9]{2}|399999[0-8][0-9]|3999999[0-9])");
    if (number.match(re) != null)
        return "Diners-1";

    // Carte Blanche
    re = new RegExp("^30[0-5]");
    if (number.match(re) != null)
        return "Diners - Carte Blanche";

    // Diners End --------------------------------------------------------------------------------------------------------------------------

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (number.match(re) != null)
        return "JCB";    

    // China Union Pay
    re = new RegExp("^(62[0-9]{14,17})$");
    if (number.match(re) != null)
        return "CUP";

    // Maestro
    re = new RegExp("^(5018)");
    if (number.match(re) != null)
        return "Maestro";

    // Not supported starting numbers
    // re = new RegExp("^(3|4|9|51|52|53|54|55|2131|1800|589460)|^(222[1-8][0-9]{2}|2229[0-8][0-9]|22299[0-9]|22[3-9][0-9]{3}|2[3-6][0-9]{4}|27[01][0-9]{3}|2720[0-8][0-9]|27209[0-9])");
    // if (number.match(re) == null)
    //     return "NotSupported";

    // return "";
}

function showCardLogo(cardType) {
    var logo = $('#cardLogo');
    switch (cardType) {
        case 'Maestro':
            $(logo).attr('src', '../public/img/card/maestro.png');
            break;        

        case 'Visa':
            $(logo).attr('src', '../public/img/card/visa.png');
            break;
        
        case 'Mastercard':
            $(logo).attr('src', '../public/img/card/mastercard.png')
            break;                                        

        case 'JCB':
            $(logo).attr('src', '../public/img/card/jcb.png')
            break;    
            
        case 'AMEX':
            $(logo).attr('src', '../public/img/card/amex.png')
            break;     

        case 'CUP':
            $(logo).attr('src', '../public/img/card/cup.png')
            break;     

        case 'Diners-1':
            $(logo).attr('src', '../public/img/card/diners.png')
            break;      
        
        case 'Diners-2':
            $(logo).attr('src', '../public/img/card/diners.png')
            break;      

        case 'Discover':
            $(logo).attr('src', '../public/img/card/discover.png')
            break;      
    
        case 'PrivateLabel':
            $(logo).attr('src', '../public/img/card/private.png')
            break;
        
        case 'NotSupported':
            $(logo).attr('src', '../public/img/card/card_warning.png');
            break;

        default:   
            $(logo).attr('src', '../public/img/card/card_warning.png');                                          
            break; 
    }
}

function getValidLengths(cardType) {
    switch (cardType) {
        case 'Visa':
            return { length1: 13, length2: 16 }
        
        case 'Diners-1':
            return { length1: 16, length2: 19 }   

        case 'Diners-2':
            return { length1: 14, length2: 19 }         

        case 'Discover':
            return { length1: 16, length2: 19 }

        default:   
            return { length1: 16 }
    }
}

function limitCardInputLength(el, cardType) {
    if (cardType == 'Diners-1' || cardType == 'Diners-2' || cardType == 'Discover') {
        $(el).attr('maxlength', 19);
    } else {  
        $(el).attr('maxlength', 16);
    }
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

// function limitCardLengthByStartingNumbers(el) {
//     var number = el.value;
//     // Supported starting numbers
//     re = new RegExp("^(3|4|9|51|52|53|54|55|2131|1800|589460)|^(222[1-8][0-9]{2}|2229[0-8][0-9]|22299[0-9]|22[3-9][0-9]{3}|2[3-6][0-9]{4}|27[01][0-9]{3}|2720[0-8][0-9]|27209[0-9])");
//     if (number.match(re) != null) {
//         re = new RegExp("^(3|4|9|51|52|53|54|55|589460)|^(222[1-8][0-9]{2}|2229[0-8][0-9]|22299[0-9]|22[3-9][0-9]{3}|2[3-6][0-9]{4}|27[01][0-9]{3}|2720[0-8][0-9]|27209[0-9])");
//         if (number.match(re) != null) $(el).attr('maxlength', 16)
//         re = new RegExp("^(2131|1800)");
//         if (number.match(re) != null) $(el).attr('maxlength', 15);
//     }
// }