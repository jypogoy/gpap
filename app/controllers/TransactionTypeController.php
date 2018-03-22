<?php

class TransactionTypeController extends ControllerBase
{

    public function initialize() {
        
    }

    public function listAction()
    {
        $this->view->disable();
        
        $types = TransactionType::find();

        $this->response->setJsonContent($types);
        $this->response->send();     
    }

}

