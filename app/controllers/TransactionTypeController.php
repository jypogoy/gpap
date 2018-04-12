<?php

class TransactionTypeController extends ControllerBase
{

    public function initialize() {
        
    }

    public function listAction()
    {
        $this->view->disable();
        
        try {
            $types = TransactionType::find();

            $this->response->setJsonContent($types);
            $this->response->send();     

        } catch (\Exception $e) {            
            $this->exceptionLogger->error(parent::_constExceptionMessage($e));
        }
    }

}

