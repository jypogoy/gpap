<?php

class InstallmentMonthsController extends ControllerBase
{

    public function initialize() {
        
    }

    public function listAction()
    {
        $this->view->disable();
        
        $months = InstallmentMonths::find();

        $this->response->setJsonContent($months);
        $this->response->send();     
    }

}

