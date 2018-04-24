<?php

class PullReasonController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByLevelAction($level)
    {
        $this->view->disable();
        
        try {
            $reasons = PullReason::find(
                [
                    "conditions" => "level = '" . $level . "'"
                ]
            );

            $this->response->setJsonContent($reasons);
            $this->response->send();     

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

}

