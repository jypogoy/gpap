<?php

class OtherExceptionController extends ControllerBase
{

    public function initialize() {
        
    }

    public function listAction()
    {
        $this->view->disable();
        
        try {
            $exceptions = OtherException::find();

            $this->response->setJsonContent($exceptions);
            $this->response->send();     

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

}

