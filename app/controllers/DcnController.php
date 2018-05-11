<?php

class DCNController extends ControllerBase
{

    public function initialize()
    {
       
    }

    public function getSameMidAmountRegionAction()
    {
        $this->view->disable();

        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        $dcn = $this->request->getPost('dcn');
        $mid = $this->request->getPost('merchant_number');
        $amount = $this->request->getPost('deposit_amount');
        $region = $this->request->getPost('region_code');

        try {
            $dcn = Dcn::findFirst(
                [
                    'dcn = ?1 AND merchant_number = ?2 AND amount = ?3 AND region_code = ?4 ',
                    'bind'  => [
                        1   =>  $dcn,
                        2   =>  $mid,
                        3   =>  $amount,
                        4   =>  $region
                    ]
                ]
            );

            $this->response->setJsonContent($dcn);
            $this->response->send(); 

        } catch (\Exception $e) {     
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }

    }

    public function getSameRegionDayAction()
    {
        $this->view->disable();

        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        $dcn = $this->request->getPost('dcn');
        $region = $this->request->getPost('region_code');

        try {
            $dcn = Dcn::findFirst(
                [
                    'dcn = ?1 AND region_code = ?2 AND DATE(created_at) = DATE(NOW())',
                    'bind'  => [
                        1   =>  $dcn,
                        2   =>  $region
                    ]
                ]
            );

            $this->response->setJsonContent($dcn);
            $this->response->send(); 

        } catch (\Exception $e) {     
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
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
            $dcn->merchant_number = $this->request->getPost('merchant_number');
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
