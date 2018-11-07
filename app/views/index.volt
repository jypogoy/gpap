<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" type="image/x-icon" href="{{ url('img/favicon.ico') }}"/>
        
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        {{ get_title() }}
        {{ stylesheet_link('css/bootstrap.min.css') }}
        {{ stylesheet_link('semantic/semantic.min.css') }}
        {{ stylesheet_link('semantic/calendar.min.css') }}
        {{ stylesheet_link('jqueryui/jquery-ui.min.css') }}
        {{ stylesheet_link('jqueryui/jquery-ui.structure.css') }}
        {{ stylesheet_link('toastr/toastr.min.css') }}
        {{ stylesheet_link('css/app.css') }}
                
    </head>
    <body>    
        {{ javascript_include('js/jquery-3.3.1.min.js') }}        
        {{ content() }}                
        {{ javascript_include('jqueryui/jquery-ui.min.js') }}       
        {{ javascript_include('semantic/semantic.min.js') }}
        {{ javascript_include('semantic/calendar.min.js') }}
        {{ javascript_include('toastr/toastr.min.js') }}
        {{ javascript_include('js/tiff.min.js') }}   
        {{ javascript_include('js/hashmap.js') }} 
        {{ javascript_include('js/keypress.js') }} 
        {{ javascript_include('js/accounting.min.js') }} 
        {{ javascript_include('js/moment.min.js') }} 
        {{ javascript_include('js/decimal.min.js') }} 

        {{ javascript_include('js/app.js') }}
        {{ javascript_include('js/util.js') }}
        {{ javascript_include('js/list.js') }}
        {{ javascript_include('js/message.js') }}
        {{ javascript_include('js/form.js') }}
        {{ javascript_include('js/cc_helpers.js') }}          
    </body>
</html>