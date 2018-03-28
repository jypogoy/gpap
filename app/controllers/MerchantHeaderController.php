<?php

class MerchantHeaderController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByBatchAction($batchId)
    {                
        $this->view->disable();
        
        $header = MerchantHeader::findFirst(
            [
                "conditions" => "batch_id = " . $batchId
            ]
        );

        $this->response->setJsonContent($header);
        $this->response->send();        
    }

    public function saveAction()
    {
        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        $header = new MerchantHeader();
        $header->batch_id = $this->request->getPost('batch_id');
        $header->merchant_number = $this->request->getPost('merchant_number') == '' ? null : $this->request->getPost('merchant_number');
        $header->merchant_name = $this->request->getPost('merchant_name') == '' ? null : $this->request->getPost('merchant_name');
        $header->currency_id = $this->request->getPost('currency_code') == '' ? null : $this->request->getPost('currency_code');
        $header->dcn = $this->request->getPost('dcn') == '' ? null : $this->request->getPost('dcn');
        $header->deposit_date = $this->request->getPost('deposit_date') == 'NaN-NaN-NaN' ? null : $this->request->getPost('deposit_date');
        $header->deposit_amount = $this->request->getPost('deposit_amount') == '' ? null : $this->request->getPost('deposit_amount');
        $header->pull_reason_id = $this->request->getPost('batch_pull_reason') == '' ? null : $this->request->getPost('batch_pull_reason');


        if (!$header->save()) {
            $errorMsg;
            foreach ($task->getMessages() as $message) {
                $errorMsg = $errorMsg . $message;
            }
            return $errorMsg;
        }

        return $header->id;
    }
    
}
