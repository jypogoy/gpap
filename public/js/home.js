$(function () {

    toastr.options = { 
        "positionClass" : "toast-top-center toastr-custom-pos"
    };

    $('.loader').fadeOut();

    $('.get-batch').click(function(e) {        
        loadAvailableBatches();
    });

});

var BatchModal = {
    show : function () {                
        $('.modal.batch')
        .modal('setting',
        {
            inverted : true,
            closable : true,
            onDeny : function(){
                // Do nothing
            },
            onApprove : function() {
                //window.location = 'boards/delete/' + id;
            }
        })
        .modal('setting', { detachable:false })
        .modal('show');
    },
    hide : function () {
        $('.modal.batch').modal('hide');
    }
}

function loadAvailableBatches() {
    $.post('batch/listavailable/', function (data) {
        console.log(data)
        if (!data) {
            toastr.warning('The search did not match any batch.');
            $('.modal.batch').modal('hide');           
        } else {
            $('#batchTable tbody tr').remove();
            $.each(data, function(i, rec) {
                $('#batchTable tbody').append(
                    '<tr>' +
                        '<td>' + rec.Zip + '</td>' + 
                        '<td>2</td>' + 
                        '<td>3</td>' +
                        '<td>4</td>' +
                        '<td>' + rec.id + '</td>' +
                        '<td>' +
                            '<a href="de/' + rec.id + '" class="ui icon" data-tooltip="Start" data-position="bottom center">' +
                                '<i class="large play circle icon"></i>' +
                            '</a>' +
                        '</td>' +
                    '</tr>');  
            }); 
        }                
    })
    .done(function (msg) {
        BatchModal.show();
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });
}