function highlightOnDelete(row, emptyMsg, emptyMsgColSpan) {
    row.effect('highlight', {}, 500, function(){ // See app.css for highlight class
        $(this).fadeOut('fast', function(){            
            var table = $(this).closest('table');
            $(this).remove();        
            if($(table).find('tbody tr').length ==0 ) { 
                $(table).find('tbody').append('<tr><td colspan="' + emptyMsgColSpan + '">' + emptyMsg + '</td></tr>'); 
            }
        });
    });  
}