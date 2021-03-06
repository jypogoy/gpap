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

        $header = null;
        $deId = $this->request->getPost('data_entry_id');
        $batchId = $this->request->getPost('batch_id');

        try {                      
            // Start a transaction
            $this->db->begin();
            
            // Update any existing header content.
            $header = MerchantHeader::findFirst(
                [
                    "conditions" => "data_entry_id = ?1 AND batch_id = ?2",
                    "bind"  => [
                        1   => $deId,
                        2   => $batchId
                    ]
                ]
            );
            
            // Set a new instance if no existing record found.
            if (!$header) $header = new MerchantHeader();
            
            $header->data_entry_id = $deId;
            $header->batch_id = $this->request->getPost('batch_id');
            $header->merchant_number = $this->request->getPost('merchant_number') == '' ? null : $this->request->getPost('merchant_number');
            $header->merchant_name = $this->request->getPost('merchant_name') == '' ? null : $this->request->getPost('merchant_name');
            $header->currency_id = $this->request->getPost('currency_id') == '' ? null : $this->request->getPost('currency_id');
            $header->other_currency = $this->request->getPost('other_currency') == '' ? null : $this->request->getPost('other_currency');
            $header->dcn = $this->request->getPost('dcn') == '' ? null : $this->request->getPost('dcn');
            //$header->deposit_date = $this->request->getPost('deposit_date') == 'NaN-NaN-NaN' ? null : $this->request->getPost('deposit_date');
            $header->deposit_date = new \Phalcon\Db\RawValue("NOW()");
            $header->deposit_amount = $this->request->getPost('deposit_amount') == '' ? null : $this->request->getPost('deposit_amount');
            $header->batch_pull_reason_id = $this->request->getPost('batch_pull_reason_id') == '' ? null : $this->request->getPost('batch_pull_reason_id');
            
            if (!$header->save()) {
                $this->db->rollback();                
                $errorMsg = '';
                foreach ($header->getMessages() as $message) {
                    $errorMsg = $errorMsg . $message;
                }
                return $errorMsg;
            } else {
                if ($this->session->get('fromEdits')) { // Update DCN on save action while in Edit Record mode.
                    $sql = "UPDATE dcn d 
                            SET merchant_number = ?, dcn = ?, amount = ? 
                            WHERE image_path = ?";

                    $image_url = $this->request->getPost('image_path');    
                    $this->db->query($sql, [$header->merchant_number, $header->dcn, $header->deposit_amount, $image_url]);     
                }
            }

            // Commit the transaction
            $this->db->commit();

            return $header->id;

        } catch (\Exception $e) {       
            $this->db->rollback();                 
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }
    
    public function getSameAction()
    {
        $this->view->disable();

        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        $batchId = $this->request->getPost('batch_id');
        $merchantNumber = $this->request->getPost('merchant_number');
        $dcn = $this->request->getPost('dcn');
        $depositAmount = $this->request->getPost('deposit_amount');
        $regionCode = $this->request->getPost('region_code');
        $taskId = $this->request->getPost('task_id');

        try {
            $sql = "SELECT CONCAT(z.region_code, '_', z.rec_date, '_', z.operator_id, '_', LPAD(z.sequence,3,'0'), '_', tt.type, '-', SUBSTRING_INDEX(img.path, '/', -1)) AS job
                    FROM data_entry de 
                    INNER JOIN merchant_header m ON m.data_entry_id = de.id 
                    INNER JOIN task t ON t.id = de.task_id 
                    INNER JOIN batch b ON b.id = m.batch_id 
                    INNER JOIN zip z ON z.id = b.zip_id
                    INNER JOIN transaction_type tt ON tt.id = b.trans_type_id 
                    INNER JOIN image img ON img.batch_id = b.id AND img.is_start = 1 
                    WHERE de.batch_id != ? AND m.merchant_number = ? AND m.dcn = ? AND m.deposit_amount = ? AND z.region_code = ? AND t.id = ?";

            $result = $this->db->query($sql, [$batchId, $merchantNumber, $dcn, $depositAmount, $regionCode, $taskId]);
            $result = $result->fetch(\Phalcon\Db::FETCH_OBJ);
            
            $this->response->setJsonContent($result);
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

        $batchId = $this->request->getPost('batch_id');
        $dcn = $this->request->getPost('dcn');
        $regionCode = $this->request->getPost('region_code');
        $taskId = $this->request->getPost('task_id');

        try {
            $sql = "SELECT CONCAT(z.region_code, '_', z.rec_date, '_', z.operator_id, '_', LPAD(z.sequence,3,'0'), '_', tt.type, '-', SUBSTRING_INDEX(img.path, '/', -1)) AS job
                    FROM data_entry de 
                    INNER JOIN merchant_header m ON m.data_entry_id = de.id 
                    INNER JOIN task t ON t.id = de.task_id 
                    INNER JOIN batch b ON b.id = m.batch_id 
                    INNER JOIN zip z ON z.id = b.zip_id
                    INNER JOIN transaction_type tt ON tt.id = b.trans_type_id 
                    INNER JOIN image img ON img.batch_id = b.id AND img.is_start = 1 
                    WHERE de.batch_id != ? AND m.dcn = ? AND z.region_code = ? AND DATE(m.deposit_date) = DATE(NOW()) AND t.id = ?";

            $result = $this->db->query($sql, [$batchId, $dcn, $regionCode, $taskId]);
            $result = $result->fetch(\Phalcon\Db::FETCH_OBJ);
           
            $this->response->setJsonContent($result);
            $this->response->send();    

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }
}
