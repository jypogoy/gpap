<?php

class ErrorsController extends ControllerBase
{

    public function initialize()
    {
        $this->tag->setTitle('Oops!');
        parent::initialize();
        $this->view->setTemplateAfter('error');
    }

    public function show404Action()
    {

    }

    public function show401Action()
    {

    }

    public function show500Action()
    {

    }

}

