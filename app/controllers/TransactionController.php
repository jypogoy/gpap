<?php

use Phalcon\Filter;

class TransactionController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByHeaderAction($headerId)
    {                
        $this->view->disable();
        
        try {
            $sql = 'SELECT merchant_header_id, sequence, transaction_type_id, `region_code`, AES_DECRYPT(`card_number`, \'' . $this->config->AES_Key . '\') as card_number, `transaction_date`, `authorization_code`,
                    `transaction_amount`, `installment_months_id`, `other_inst_term`, `airline_ticket_number`, `customer_reference_identifier`, `merchant_order_number`, `commodity_code`,
                    `slip_pull_reason_id`, `exception_id`, `other_exception_detail`, `image_id`, `image_file`
                    FROM transaction 
                    WHERE merchant_header_id = ?
                    ORDER BY sequence ASC';

            $result = $this->db->query($sql, [$headerId]);        
            $result->setFetchMode(Phalcon\Db::FETCH_OBJ);

            $trans = array();
            // Match new password hash with the recorded passwords.
            while ($transaction = $result->fetch()) {
                array_push($trans, $transaction);
            }

            // $transactions = Transaction::find(
            //     [
            //         "conditions" => "merchant_header_id = " . $headerId,
            //         "order"      => "sequence ASC"
            //     ]
            // );

            // $decryptTrans = array();

            // Decrypt card information.
            // foreach ($transactions as $transaction) {
            //     $cc = $this->crypt->decrypt($transaction->card_number);
            //     //$cc = preg_replace("/[^0-9,.]/", "", $this->crypt->decrypt($transaction->card_number));
            //     if ($transaction->card_number) $transaction->card_number = $cc;
            //     array_push($decryptTrans, $transaction);
            // }

            $this->response->setJsonContent($trans);
            $this->response->send();        

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function deletePreviousAction($headerId)
    {
        $this->view->disable();

        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        try {
            $sql = 'DELETE FROM `transaction` 
                    WHERE merchant_header_id = ?';

            $this->db->query($sql, [$headerId]);
            echo true;                        

        } catch (\Exception $e) {          
            echo false;  
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function saveAction()
    {
        $this->view->disable();

        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        try {

            $filter = new Filter();

            $sqlValuePart = 'VALUES';
            $collection = $this->request->getPost('collection');
            for ($i=0; $i < count($collection); $i++) {                 
                $sqlValuePart = $sqlValuePart . '(';
                $slip = $collection[$i];
                $sqlValuePart = $sqlValuePart . $slip['merchant_header_id'] . ',';        
                $sqlValuePart = $sqlValuePart . $slip['sequence'] . ',';        
                $sqlValuePart = $sqlValuePart . ($filter->sanitize($slip['transaction_type_id'], 'int') == '' ? 'null' : $filter->sanitize($slip['transaction_type_id'], 'int')) . ',';
                $sqlValuePart = $sqlValuePart . ($filter->sanitize($slip['region_code'], 'string') == '' ? 'null' : '\'' . $filter->sanitize($slip['region_code'], 'string') . '\'') . ',';
                $sqlValuePart = $sqlValuePart . ($filter->sanitize($slip['card_number'], 'string') == '' ? 'null' : 'AES_ENCRYPT(' . $filter->sanitize($slip['card_number'], 'string') . ', \'' . $this->config->AES_Key . '\')') . ',';
                $sqlValuePart = $sqlValuePart . ($slip['transaction_date'] == 'NaN-NaN-NaN' ? 'null' : '\'' . $slip['transaction_date'] . '\'') . ',';
                $sqlValuePart = $sqlValuePart . ($filter->sanitize($slip['authorization_code'], 'string') == '' ? 'null' : '\'' . $filter->sanitize($slip['authorization_code'], 'string') . '\'') . ',';
                $sqlValuePart = $sqlValuePart . ($slip['transaction_amount'] == '' ? 'null' : $slip['transaction_amount']) . ',';
                $sqlValuePart = $sqlValuePart . ($slip['installment_months_id'] == '' ? 'null' : $slip['installment_months_id']) . ',';
                $sqlValuePart = $sqlValuePart . ($slip['other_inst_term'] == '' ? 'null' : $slip['other_inst_term']) . ',';
                $sqlValuePart = $sqlValuePart . ($filter->sanitize($slip['airline_ticket_number'], 'string') == '' ? 'null' : '\'' . $filter->sanitize($slip['airline_ticket_number'], 'string') . '\'') . ',';
                $sqlValuePart = $sqlValuePart . ($filter->sanitize($slip['customer_reference_identifier'], 'string') == '' ? 'null' : '\''. substr($filter->sanitize($slip['customer_reference_identifier'], 'string'), 0, 17) . '\'') . ',';
                $sqlValuePart = $sqlValuePart . ($filter->sanitize($slip['merchant_order_number'], 'string') == '' ? 'null' : '\'' . substr($filter->sanitize($slip['merchant_order_number'], 'string'), 0, 25) . '\'') . ',';
                $sqlValuePart = $sqlValuePart . ($filter->sanitize($slip['commodity_code'], 'string') == '' ? 'null' : '\'' . $filter->sanitize($slip['commodity_code'], 'string') . '\'') . ',';
                $sqlValuePart = $sqlValuePart . ($slip['slip_pull_reason_id'] == '' ? 'null' : $slip['slip_pull_reason_id']) . ',';
                $sqlValuePart = $sqlValuePart . ($slip['exception_id'] == '' ? 'null' : $slip['exception_id']) . ',';
                $sqlValuePart = $sqlValuePart . ($filter->sanitize($slip['other_exception_detail'], 'string') == '' ? 'null' : '\'' . $filter->sanitize($slip['other_exception_detail'], 'string') . '\'') . ',';
                $sqlValuePart = $sqlValuePart . ($slip['image_id'] == '' ? 'null' : $slip['image_id']) . ',';
                $sqlValuePart = $sqlValuePart . ($filter->sanitize($slip['image_file'], 'string') == '' ? 'null' : '\'' . $filter->sanitize($slip['image_file'], 'string') . '\'');
                $sqlValuePart = $sqlValuePart . ')';
                if ($i < (count($collection) - 1)) $sqlValuePart  = $sqlValuePart . ',';        
            }

            $sql = 'INSERT INTO `transaction` (`merchant_header_id`, `sequence`, `transaction_type_id`, `region_code`, `card_number`, `transaction_date`, `authorization_code`,
                    `transaction_amount`, `installment_months_id`, `other_inst_term`, `airline_ticket_number`, `customer_reference_identifier`, `merchant_order_number`, `commodity_code`,
                    `slip_pull_reason_id`, `exception_id`, `other_exception_detail`, `image_id`, `image_file`) ';
            
            $sql = $sql . $sqlValuePart;        
            
            $result =  $this->db->query($sql);
            if ($result->numRows() > 0) {
                echo 1;
            } else {
                echo 0;
            }        
                    
        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function transDateElevenMonthsOlderAction($transDate)
    {
        $this->view->disable();
        
        try {
            $sql = "SELECT ? < DATE_ADD(CURDATE(), INTERVAL -11 MONTH) AS is_older";

            $result = $this->db->query($sql, [$transDate]);

            $this->response->setJsonContent($result->fetch());
            $this->response->send();

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function transDateFutureAction($transDate)
    {
        $this->view->disable();
        
        try {
            $sql = "SELECT ? > CURDATE() AS is_future";

            $result = $this->db->query($sql, [$transDate]);

            $this->response->setJsonContent($result->fetch());
            $this->response->send();

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

}
