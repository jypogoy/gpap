<?php

class DeController extends ControllerBase
{

    public function initialize()
    {
        $this->tag->setTitle('Data Entry');
        parent::initialize();
    }

    public function indexAction()
    {
        $form = new CaptureForm();
        $this->view->form = $form;
        $this->view->setTemplateAfter('de');
    }

}
