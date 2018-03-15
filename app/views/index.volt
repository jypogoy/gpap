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
        {{ stylesheet_link('jqueryui/jquery-ui.min.css') }}
        {{ stylesheet_link('jqueryui/jquery-ui.structure.css') }}
        {#{ stylesheet_link('diva/diva.min.css') }}    


        {{ stylesheet_link('iipmooviewer/css/iip.min.css') }}
        {{ stylesheet_link('iipmooviewer/css/gallery.min.css') }}
        {{ stylesheet_link('iipmooviewer/css/ie.min.css') }#}
       
        {{ stylesheet_link('css/app.css') }}
        
        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Oswald" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    </head>
    <body>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>
        {{ javascript_include('js/jquery-3.3.1.min.js') }}        
        {{ content() }}                
        {{ javascript_include('jqueryui/jquery-ui.min.js') }}       
        {{ javascript_include('semantic/semantic.min.js') }}
        {{ javascript_include('toastr/toastr.min.js') }}
        {{ javascript_include('js/app.js') }}
        {{ javascript_include('js/list.js') }}
        {{ javascript_include('js/message.js') }}
        {{ javascript_include('js/form.js') }}

        {{ javascript_include('js/tiff.min.js') }}   

        {#{ javascript_include('diva/diva.min.js') }}    
        
        {{ javascript_include('iipmooviewer/js/mootools-core-1.6.0-compressed.js') }}  
        {{ javascript_include('iipmooviewer/js/iipmooviewer-2.0-min.js') }}   
        {{ javascript_include('iipmooviewer/js/gallery.min.js') }#}   

        {#{ javascript_include('js/register.js') }#}
    </body>
</html>