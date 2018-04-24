<?php

use Phalcon\Filter;

class MerchantHeaderController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getAction()
    {                
        $this->view->disable();
        
        $deId = $this->request->getPost('data_entry_id');
        $batchId = $this->request->getPost('batch_id');

        try {
            $header = MerchantHeader::findFirst(
                [
                    "conditions" => "data_entry_id = " . $deId . " AND batch_id = " . $batchId
                ]
            );

            $this->response->setJsonContent($header);
            $this->response->send();        

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function saveAction()
    {
        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        $deId = $this->request->getPost('data_entry_id');
        $batchId = $this->request->getPost('batch_id');

        try {
            // Update any existing header content.
            $header = MerchantHeader::findFirst(
                [
                    "conditions" => "data_entry_id = " . $deId . " AND batch_id = " . $batchId
                ]
            );
            
            //$header = MerchantHeader::findById($this->request->getPost('id'), 'int');

            // Set a new instance if no existing record found.
            if (!$header) $header = new MerchantHeader();
            
            $header->data_entry_id = $this->request->getPost('data_entry_id');
            $header->batch_id = $this->request->getPost('batch_id');
            $header->merchant_number = $this->request->getPost('merchant_number') == '' ? null : $this->request->getPost('merchant_number');
            $header->merchant_name = $this->request->getPost('merchant_name') == '' ? null : $this->request->getPost('merchant_name');
            $header->currency_id = $this->request->getPost('currency_id') == '' ? null : $this->request->getPost('currency_id');
            $header->other_currency = $this->request->getPost('other_currency') == '' ? null : $this->request->getPost('other_currency');
            $header->dcn = $this->request->getPost('dcn') == '' ? null : $this->request->getPost('dcn');
            $header->deposit_date = $this->request->getPost('deposit_date') == 'NaN-NaN-NaN' ? null : $this->request->getPost('deposit_date');
            $header->deposit_amount = $this->request->getPost('deposit_amount') == '' ? null : $this->request->getPost('deposit_amount');
            $header->batch_pull_reason_id = $this->request->getPost('batch_pull_reason_id') == '' ? null : $this->request->getPost('batch_pull_reason_id');
            
            if (!$header->save()) {
                $errorMsg;
                foreach ($task->getMessages() as $message) {
                    $errorMsg = $errorMsg . $message;
                }
                return $errorMsg;
            }

            return $header->id;

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }
    
    public function getSameAction()
    {
        $this->view->disable();

        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        $merchantNumber = $this->request->getPost('merchant_number');
        $dcn = $this->request->getPost('dcn');
        $depositAmount = $this->request->getPost('deposit_amount');
        $regionCode = $this->request->getPost('region_code');
        $taskId = $this->request->getPost('task_id');

        try {
            $sql = 'SELECT COUNT(de.id) AS Total 
                    FROM data_entry de 
                    INNER JOIN merchant_header m ON m.data_entry_id = de.id 
                    INNER JOIN task t ON t.id = de.task_id 
                    INNER JOIN batch b ON b.id = m.batch_id 
                    INNER JOIN zip z ON z.id = b.zip_id 
                    WHERE m.merchant_number = ? AND m.dcn = ? AND m.deposit_amount = ? AND z.region_code = ? AND t.id = ?';

            $result = $this->db->query($sql, [$merchantNumber, $dcn, $depositAmount, $regionCode, $taskId]);
            $result = $result->fetchAll($result);
           
            $total = intval($result[0]['Total']);
            echo $total > 0 ? true : false;    

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }
}
