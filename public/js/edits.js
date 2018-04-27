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

    $('.loader').fadeOut();
});