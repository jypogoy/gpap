<?php

class TransactionController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByHeaderAction($headerId)
    {                
        $this->view->disable();
        
        $transactions = Transaction::find(
            [
                "conditions" => "merchant_header_id = " . $headerId,
                "order"      => "sequence ASC"
            ]
        );

        $this->response->setJsonContent($transactions);
        $this->response->send();        
    }

    public function deletePreviousAction($headerId)
    {
        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        // Delete any existing transaction content.
        $existingTrans = Transaction::find(
            [
                "conditions" => "merchant_header_id = " . $headerId
            ]
        );

        if ($existingTrans) {
            if (!$existingTrans->delete()) {
                foreach ($existingTrans->getMessages() as $message) {
                    $this->flash->error($message);
                }

                $this->dispatcher->forward([
                    'controller' => "home",
                    'action' => 'index'
                ]);

                return;
            } else {
                echo 1;
            }
        }  else {
            echo 0;
        }      
    }

    public function saveAction()
    {
        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        // Record a new header content.
        $transaction = new Transaction();
        $transaction->merchant_header_id = $this->request->getPost('merchant_header_id');
        $transaction->sequence = $this->request->getPost('sequence');
        $transaction->transaction_type_id = $this->request->getPost('transaction_type_id') == '' ? null : $this->request->getPost('transaction_type_id');
        $transaction->region_code = $this->request->getPost('region_code') == '' ? null : $this->request->getPost('region_code');
        $transaction->card_number = $this->request->getPost('card_number') == '' ? null : $this->request->getPost('card_number');
        $transaction->transaction_date = $this->request->getPost('transaction_date') == 'NaN-NaN-NaN' ? null : $this->request->getPost('transaction_date');
        $transaction->authorization_code = $this->request->getPost('authorization_code') == '' ? null : $this->request->getPost('authorization_code');
        $transaction->transaction_amount = $this->request->getPost('transaction_amount') == '' ? null : $this->request->getPost('transaction_amount');
        $transaction->installment_months_id = $this->request->getPost('installment_months_id') == '' ? null : $this->request->getPost('installment_months_id');
        $transaction->airline_ticket_number = $this->request->getPost('airline_ticket_number') == '' ? null : $this->request->getPost('airline_ticket_number');
        $transaction->customer_reference_identifier = $this->request->getPost('customer_reference_identifier') == '' ? null : $this->request->getPost('customer_reference_identifier');
        $transaction->merchant_order_number = $this->request->getPost('merchant_order_number') == '' ? null : $this->request->getPost('merchant_order_number');
        $transaction->commodity_code = $this->request->getPost('commodity_code') == '' ? null : $this->request->getPost('commodity_code');
        $transaction->slip_pull_reason_id = $this->request->getPost('slip_pull_reason_id') == '' ? null : $this->request->getPost('slip_pull_reason_id');
        $transaction->exception_id = $this->request->getPost('exception_id') == '' ? null : $this->request->getPost('exception_id');
        $transaction->variance_exception = $this->request->getPost('variance_exception') == '1' ? 1 : 0;
        $transaction->other_exception_detail = $this->request->getPost('other_exception_detail') == '' ? null : $this->request->getPost('other_exception_detail');

        $successMsg = "Transaction was saved successfully.";

        if (!$transaction->save()) {
            $errorMsg = '';
            foreach ($transaction->getMessages() as $message) {
                $errorMsg = $errorMsg . $message;
            }
            return $errorMsg;
        }

        return $successMsg;
    }
    
}
