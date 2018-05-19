<?php

class HomeController extends ControllerBase
{

    public function initialize()
    {
        $this->tag->setTitle('Welcome');
        parent::initialize();        

        if ($this->session->get('initLogin')) {
            return $this->response->redirect('session/changepassword');            
        } 
    }

    public function indexAction()
    {
        $this->view->user = $this->session->get('auth');       
        $this->sessionLogger->info($this->session->get('auth')['name'] . ' @ Home page.'); 
    }

    public function beforeExecuteRoute()
	{
        parent::checkSession();
    }

}