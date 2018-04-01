<?php

class HomeController extends ControllerBase
{

    public function initialize()
    {
        $this->tag->setTitle('Welcome');
        parent::initialize();
    }

    public function indexAction()
    {
        $this->view->user = $this->session->get('auth');        
    }

}