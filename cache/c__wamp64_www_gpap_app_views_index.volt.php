<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" type="image/x-icon" href="<?= $this->url->get('img/favicon.ico') ?>"/>
        
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <?= $this->tag->getTitle() ?>
        <?= $this->tag->stylesheetLink('css/bootstrap.min.css') ?>
        <?= $this->tag->stylesheetLink('semantic/semantic.min.css') ?>
        <?= $this->tag->stylesheetLink('semantic/calendar.min.css') ?>
        <?= $this->tag->stylesheetLink('jqueryui/jquery-ui.min.css') ?>
        <?= $this->tag->stylesheetLink('jqueryui/jquery-ui.structure.css') ?>
        <?= $this->tag->stylesheetLink('toastr/toastr.min.css') ?>
        <?= $this->tag->stylesheetLink('css/app.css') ?>
        
        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Oswald" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    </head>
    <body>    
        <?= $this->tag->javascriptInclude('js/jquery-3.3.1.min.js') ?>        
        <?= $this->getContent() ?>                
        <?= $this->tag->javascriptInclude('jqueryui/jquery-ui.min.js') ?>       
        <?= $this->tag->javascriptInclude('semantic/semantic.min.js') ?>
        <?= $this->tag->javascriptInclude('semantic/calendar.min.js') ?>
        <?= $this->tag->javascriptInclude('toastr/toastr.min.js') ?>
        <?= $this->tag->javascriptInclude('js/tiff.min.js') ?>   
        <?= $this->tag->javascriptInclude('js/hashmap.js') ?> 

        <?= $this->tag->javascriptInclude('js/app.js') ?>
        <?= $this->tag->javascriptInclude('js/util.js') ?>
        <?= $this->tag->javascriptInclude('js/list.js') ?>
        <?= $this->tag->javascriptInclude('js/message.js') ?>
        <?= $this->tag->javascriptInclude('js/form.js') ?>
    </body>
</html>