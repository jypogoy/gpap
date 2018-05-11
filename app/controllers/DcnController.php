<?php

class DcnController extends ControllerBase
{

    public function initialize()
    {
       
    }

    public function recordAction()
    {
        $this->view->disable();

        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        try {
            $dcn = new Dcn();
            $dcn->region_code = $this->request->getPost('region_code');
            $dcn->mid = $this->request->getPost('mid');
            $dcn->dcn = $this->request->getPost('dcn');
            $dcn->amount = $this->request->getPost('amount');
            $dcn->image_path = $this->request->getPost('image_path');
            
            if (!$dcn->save()) {
                $this->errorLogger->error(parent::_constExceptionMessage('Unable to log DCN information:'));
                $messages = $dcn->getMessages();
                foreach ($messages as $message) {
                    $this->errorLogger->error(parent::_constExceptionMessage($message));
                }

                echo false;
            } else {
                echo true;
            }

        } catch (\Exception $e) {            
            echo false;
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }
    
}
