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

        $task_id = $this->request->getPost('task_id');
        $dcn = $this->request->getPost('dcn');        
        $mid = $this->request->getPost('merchant_number');
        $amount = $this->request->getPost('deposit_amount');
        $region = $this->request->getPost('region_code');

        try {
            $dcn = Dcn::findFirst(
                [
                    'task_id = ?1 AND dcn = ?2 AND merchant_number = ?3 AND amount = ?4 AND region_code = ?5 ',
                    'bind'  => [
                        1   =>  $task_id,
                        2   =>  $dcn,
                        3   =>  $mid,
                        4   =>  $amount,
                        5   =>  $region
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

        $task_id = $this->request->getPost('task_id');
        $dcn = $this->request->getPost('dcn');
        $region = $this->request->getPost('region_code');

        try {
            $dcn = Dcn::findFirst(
                [
                    'task_id = ?1 AND dcn = ?2 AND region_code = ?3 AND DATE(created_at) = DATE(NOW())',
                    'bind'  => [
                        1   =>  $task_id,
                        2   =>  $dcn,
                        3   =>  $region
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
            $dcn->task_id = $this->request->getPost('task_id');
            $dcn->batch_id = $this->request->getPost('batch_id');
            $dcn->region_code = $this->request->getPost('region_code');
            $dcn->merchant_number = $this->request->getPost('merchant_number');
            $dcn->dcn = $this->request->getPost('dcn');
            $dcn->amount = $this->request->getPost('amount');
            $dcn->image_path = $this->request->getPost('image_path');
            
            if (!$dcn->save()) {
                $this->errorLogger->error('Unable to log DCN information: ' . json_encode($dcn));
                foreach ($dcn->getMessages() as $message) {
                    $this->errorLogger->error($message->getMessage());
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
