<?php

class PullReasonController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByLevelAction($level)
    {
        $this->view->disable();
        
        $reasons = PullReason::find(
            [
                "conditions" => "level = '" . $level . "'"
            ]
        );

        $this->response->setJsonContent($reasons);
        $this->response->send();     
    }

}

