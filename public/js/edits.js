$(function() {

    $('#region_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');
            $.post('edits/getjobsbyregion/' + value, function (data) {
                $('#job_dropdown').dropdown('restore defaults');
                $('#job_dropdown .menu').empty();
                if (!data) {
                    toastr.info('There are currently no jobs for this region. \nPlease choose another.');
                    $('.job_field').addClass('disabled');
                } else {                                                            
                    $(data).appendTo('#job_dropdown .menu');    
                    $('.job_field').removeClass('disabled');               
                }
            })
            .fail(function (xhr, status, error) {
                toastr.error(error);
            });
        }
    });    

    $('#job_dropdown').dropdown({
        onChange: function() {
            var value = $(this).dropdown('get value');
            if (value) {
                $('#filterBtn').removeClass('disabled');
            } else {
                $('#filterBtn').addClass('disabled');
            }            
        }
    }); 

    $('#filterBtn').click(function() {
        filterBatches();
    });

    $('.loader').fadeOut();
});

function filterBatches() {
    $('.loader').show();

    var wrapper = $('.listBody');
    $(wrapper).empty();
    $(wrapper).append('<tr><td colspan="6">Fetching record....</td></tr>');

    var jobArr = $('#job_dropdown').dropdown('get text').split('_'); //[rec_date, operator_id, sequence]
    var params = {};
    params.region_code = $('#region_code').val();    
    params.rec_date = jobArr[0];
    params.operator_id = jobArr[1];
    params.sequence = jobArr[2];    
    $.post('batch/listbyregionjob/', params, function (data) {  
        $(wrapper).empty();      
        if (!data) {
            $(wrapper).append('<tr><td colspan="6">No records found.</td></tr>');
        } else {
            if (data.indexOf('alert') != -1) {
                toastr.error(data);
            } else {                                
                $(data).appendTo(wrapper);
            }            
        }       
        $('.loader').fadeOut();         
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });   
}