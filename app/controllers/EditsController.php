<?php

class EditsController extends ControllerBase
{
    
    public function initialize()
    {
        $this->tag->setTitle('Edits');
        parent::initialize();

        if ($this->session->get('initLogin')) {
            return $this->response->redirect('session/changepassword');            
        } 
    }


    public function indexAction()
    {
        $this->sessionLogger->info($this->session->get('auth')['name'] . ' @ Edits page.'); 
    }

}

