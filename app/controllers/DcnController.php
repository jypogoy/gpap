<?php

class AboutController extends ControllerBase
{

    public function initialize()
    {
       
    }

    public function logAction()
    {
        $this->view->disable();

        try {
            $dcn = new Dcn();
            $dcn->region_code = $this->request->getPost('region_code');
            $dcn->mid = $this->request->getPost('mid');
            $dcn->amount = $this->request->getPost('amount');

            if (!$dcn->save()) {
                $this->errorLogger->error(parent::_constExceptionMessage('Unable to log DCN information:'));
                $messages = $dcn->getMessages();
                foreach ($messages as $message) {
                    $this->errorLogger->error(parent::_constExceptionMessage($message));
                }
            }

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }
    
}
