function gatherHeaderValues() {
    var fields = $('.header-field');
    var data = {};
    data.batch_id = $('#batch_id').val();
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