<?php

class OtherExceptionController extends ControllerBase
{

    public function initialize() {
        
    }

    public function listAction()
    {
        $this->view->disable();
        
        $exceptions = OtherException::find();

        $this->response->setJsonContent($exceptions);
        $this->response->send();     
    }

}

