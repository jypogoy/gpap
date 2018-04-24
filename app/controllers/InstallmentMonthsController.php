<?php

class InstallmentMonthsController extends ControllerBase
{

    public function initialize() {
        
    }

    public function listAction()
    {
        $this->view->disable();
        
        try {
            $months = InstallmentMonths::find();

            $this->response->setJsonContent($months);
            $this->response->send();    
            
        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

}

