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
        $header->merchant_number = $this->request->getPost('merchant_number');
        $header->merchant_name = $this->request->getPost('merchant_name');
        $header->currency_id = $this->request->getPost('currency_code');
        $header->dcn = $this->request->getPost('dcn');
        $header->deposit_date = $this->request->getPost('deposit_date');
        $header->deposit_amount = $this->request->getPost('deposit_amount');
        $header->pull_reason_id = $this->request->getPost('batch_pull_reason');

        $successMsg = "Header was saved successfully.";

        if (!$header->save()) {
            $errorMsg;
            foreach ($task->getMessages() as $message) {
                $errorMsg = $errorMsg . $message;
            }
            return $errorMsg;
        }

        return $successMsg;
    }
    
}
