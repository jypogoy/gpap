$(function () {
    Form.setFocus();    
    $("form .alert").hide();
});

var Form = {
    clear: function(isHeader) {
        if (isHeader) {
            $('.header-field').val('');
            $('.header-field').prop('checked', false);
            $('.header-dropdown').dropdown('restore defaults');
        } else {
            $('.slip-field').val('');
            $('.slip-field').prop('checked', false);
            $('.slip-dropdown').dropdown('restore defaults');
        }
    },
    validate: function(isHeader) {  
        var isValid = true;    
        var inputClass = isHeader ? '.header-field' : '.slip-field';
        $.each($(inputClass), function(i, field) {
            var wrapper = $('#' + field.id + '_wrapper');
            if ($(wrapper).hasClass('required')) {
                if (field.value == '') {
                    $(wrapper).addClass('error');
                    isValid = false;
                } else {
                    $(wrapper).removeClass('error');
                }
            }
        });

        $('.error').find('input:text, input:password, textarea').first().focus();
        if (!isValid) return false;
          
        return isValid;
    },
    hasError: function() {
        return $('form').find('*').hasClass('error');
    },
    resetErrors: function(isHeader) {
        var formId = isHeader ? 'headerDataForm' : 'transactionDataForm';
        $('#' + formId).find('*').removeClass('error');
    },
    setFocusOnError: function() {
        $('.error').find('input:text, input:password, textarea').first().focus();
    },
    setFocus: function() {
        //$("form input:text, input:password, textarea").first().focus(); 
        $('form').find("input:visible:first").focus(); 
    },
    reset: function(isEdit) {
        $('form *').filter(':input:visible, select').each(function () {
            var el = this;    
            var form = el.closest('form');                     
            $(form).find("#" + el.id + "_div").removeClass('error');
            $(form).find("#" + el.id + "_alert").addClass('hidden');
            $(form).find("#" + el.id + "_alert").removeClass('visible');
            if (!isEdit) {
                $(el).val('');                
                if ($(el).is('select')) $(el).dropdown('clear');        
                if (el.type == 'number') $(el).val(0);        
            }            
        }); 
        this.setFocus();
    }
}