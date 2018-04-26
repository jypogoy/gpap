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
        try {
            $regions = Region::find();
            $this->view->regions = $regions;
            
        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }

        $this->sessionLogger->info($this->session->get('auth')['name'] . ' @ Edits page.'); 
    }

}
