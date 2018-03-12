$(function () {
    Form.setFocus();    
    $("form .alert").hide();
});

var Form = {
    validate: function (isAjax, isSaveNew) {  
        var isValid = true;
        var form;        
        $('form *').filter(':input:visible').each(function () {            
            var el = this;
            if (!form) form = el.closest('form');
            if ($("#" + el.id + "_div").hasClass('required')) {
                if ($.trim(el.value) == '') {
                    $(form).find("#" + el.id + "_div").addClass('error');
                    $(form).find("#" + el.id + "_alert").removeClass('hidden');
                    $(form).find("#" + el.id + "_alert").addClass('visible');
                    isValid = false;
                } else {    
                    $(form).find("#" + el.id + "_div").removeClass('error');
                    $(form).find("#" + el.id + "_alert").addClass('hidden');
                    $(form).find("#" + el.id + "_alert").removeClass('visible');
                }
            }    
        });        
        
        $('.error').find('input:text, input:password, textarea').first().focus();
        if (!isValid) return false;

        $('#saveNew').val(isSaveNew);
        
        if (!isAjax) form[0].submit();          
        return isValid;
    },
    setFocus: function () {
        //$("form input:text, input:password, textarea").first().focus(); 
        $('form').find("input:visible:first").focus(); 
    },
    reset: function (isEdit) {
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