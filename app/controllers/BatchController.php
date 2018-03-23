<?php

class BatchController extends ControllerBase
{

    public function initialize() {
        
    }

    public function listAvailableAction()
    {
        $this->view->disable();
        
        $batches = Batch::find(
            [
                "conditions" => "is_completed = 0"
            ]
        );        

        $this->response->setJsonContent($batches);
        $this->response->send();     
    }

}

