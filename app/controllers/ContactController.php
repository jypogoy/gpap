<?php

class ContactController extends ControllerBase
{

    public function initialize() 
    {
        $this->tag->setTitle('Contact Us');
        parent::initialize();
    }

    public function indexAction()
    {
        $this->sessionLogger->info($this->session->get('auth')['name'] . ' @ Contact page.'); 
    }

}