var origDCN;

$(function() {    

    var sessionRegionCode = $('#session_region_code').val();    

    var sessionRecDate = $('#session_rec_date').val(); 
    if (sessionRecDate != 'undefined' && sessionRecDate != '' && sessionRecDate.indexOf('NaN') == -1) {
        $('#job_date').val($.datepicker.formatDate('mm/dd/y', new Date(sessionRecDate)));
    }

    // Instantiate the region selection element.
    $('#region_dropdown').dropdown({
        onChange: function() {

            if ($('#region_code').val() != sessionRegionCode) {
                $('#job_dropdown').dropdown('restore defaults');
                $('#job_dropdown .menu').empty();
            }

            var wrapper = $('.listBody');
            $(wrapper).empty();
            $(wrapper).append('<tr><td colspan="6">No records found.</td></tr>');

            var regionCode = $(this).dropdown('get value');            
            if (regionCode) {

                $('#filterBtn').removeClass('disabled');                                
                
                $.when(filterJobs()).done(function(jobs) {         
                    console.log(jobs)           
                    if (!jobs) {
                        toastr.info('There are currently no jobs for this region or filters did not match any record. \nPlease choose another.');
                        $('.job_date_field').removeClass('disabled');  
                        $('.job_field').removeClass('disabled');                           
                    } else {                        
                        $('.job_date_field').removeClass('disabled');  
                        $('.job_field').removeClass('disabled');   
                        $(jobs).appendTo('#job_dropdown .menu');    

                        var sessionZipId = $('#session_zip_id').val();    
                        if (sessionZipId != 'undefined' && sessionZipId != '' && sessionZipId > 0) {
                            $('#job_dropdown').dropdown('set selected', sessionZipId);
                        }                    }                                                                                                                    
                    
                    $('.loader').fadeOut();
                    filterBatches();
                });


                // $.post('edits/getjobsbyregion/' + regionCode, function (data) {
                //     $('#job_dropdown').dropdown('restore defaults');
                //     $('#job_dropdown .menu').empty();
                //     if (!data) {
                //         toastr.info('There are currently no jobs for this region. \nPlease choose another.');
                //         $('.job_date_field').addClass('disabled');  
                //         $('.job_field').addClass('disabled');                            
                //         $('#filterBtn').addClass('disabled');                    
                //     } else {                                        
                //         $('.job_date_field').removeClass('disabled');  
                //         $('.job_field').removeClass('disabled');   
                //         $(data).appendTo('#job_dropdown .menu');                            

                //         // Instantiate the job selection element.
                //         $('#job_dropdown').dropdown({
                //             onChange: function() {
                //                 //var value = $(this).dropdown('get value');                                          
                //             }
                //         });                 

                //         var sessionRecDate = $('#session_rec_date').val(); 
                //         if (sessionRecDate != 'undefined' && sessionRecDate != '') {
                //             $('#job_date').val($.datepicker.formatDate('mm/dd/y', new Date(sessionRecDate)));
                //             //filterBatches();
                //         }

                //         var sessionZipId = $('#session_zip_id').val();    
                //         if (sessionZipId != 'undefined' && sessionZipId != '' && sessionZipId > 0) {
                //             $('#job_dropdown').dropdown('set selected', sessionZipId);
                //             //filterBatches();
                //         }
                //     }
                //     $('.loader').fadeOut();
                // })
                // .fail(function (xhr, status, error) {
                //     toastr.error(error);
                // });
            } else {
                $('#filterBtn').addClass('disabled');
            }
        }
    });            

    $('#job_date_cal').calendar({ 
        type: 'date',
        monthFirst: true,
        formatter: {
            date: function (date, settings) {
                if (!date) return '';
                return formatDate(date);
            }
        },
        onChange: function(date, text, modules) {
            $('#job_date').val(text);
            $.when(filterJobs()).done(function(jobs) {
                $('#job_dropdown').dropdown('restore defaults');
                $('#job_dropdown .menu').empty();
                $('.listBody').empty();  
                if (jobs) {
                    $('.job_date_field').removeClass('disabled');  
                    $('.job_field').removeClass('disabled');   
                    $(jobs).appendTo('#job_dropdown .menu');                    
                } 
                $('.listBody').append('<tr><td colspan="6">No records found.</td></tr>');
                $('.loader').fadeOut();                
            });
        }
    });  

    //$('#job_date_cal').calendar('set date', formatDate(new Date())); // Set the initial date if none specified. 

    $('#filterBtn').click(function() {
        filterBatches();
    });

    $('#resetBtn').click(function() {
        resetFilters();
    });        
    
    if (sessionRegionCode != 'undefined' && sessionRegionCode != '') {
        $('#region_dropdown').dropdown('set selected', sessionRegionCode);
    }

    $('.loader').fadeOut();   
});

function filterJobs() {
    $('.loader').show();    
    var params = {};
    params.regionCode = $('#region_code').val();
    params.recDate = $.datepicker.formatDate('yy-mm-dd', new Date($('#job_date').val()));

    var d = $.Deferred();

    $.post('edits/getjobsbyregion/', params, function (jobs) {
        d.resolve(jobs);        
    })
    .fail(function (xhr, status, error) {
        toastr.error(error);
    });

    return d.promise();
}

function filterBatches() {
    $('.loader').show();

    var wrapper = $('.listBody');
    $(wrapper).empty();
    $(wrapper).append('<tr><td colspan="6">Fetching record....</td></tr>');

    // var jobArr = $('#job_dropdown').dropdown('get text').split('_'); //[rec_date, operator_id, sequence]
    // var params = {};
    // params.region_code = $('#region_code').val();    
    // params.rec_date = jobArr[0];
    // params.operator_id = jobArr[1];
    // params.sequence = jobArr[2];   
    var params = {};
    params.regionCode = $('#region_code').val();
    params.zipId = $('#job_dropdown').dropdown('get value'); 
    params.recDate = $.datepicker.formatDate('yy-mm-dd', new Date($('#job_date').val()));
    
    if (params.regionCode) {
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
}

function edit(batchId, taskId, taskName) {    
    var params = {};
    params.batch_id = batchId;
    params.task_id = taskId;
    params.task_name = taskName;    
    $.post('edits/prep/', params, function (data) {  
        var form = $('#beginForm');
        $(form).attr('action', 'de/' + batchId);    
        $(form).attr('method', 'POST');
        $(form).submit();
    });
}

function resetFilters() {
    $('#region_dropdown').dropdown('restore defaults');    
    $('#job_dropdown').dropdown('restore defaults');
    $('#job_dropdown .menu').empty();
    $('#job_date').val('');
    $('.job_date_field').addClass('disabled');  
    $('.job_field').addClass('disabled');  
    $('#filterBtn').addClass('disabled');
    $('.loader').fadeOut();
    $.post('edits/resetfilters');
}