<?php

class TransactionController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByHeaderAction($headerId)
    {                
        $this->view->disable();
        
        try {
            $transactions = Transaction::find(
                [
                    "conditions" => "merchant_header_id = " . $headerId,
                    "order"      => "sequence ASC"
                ]
            );

            $decryptTrans = array();

            // Decrypt card information.
            foreach ($transactions as $transaction) {
                $cc = $this->crypt->decrypt($transaction->card_number);
                //$cc = preg_replace("/[^0-9,.]/", "", $this->crypt->decrypt($transaction->card_number));
                if ($transaction->card_number) $transaction->card_number = $cc;
                array_push($decryptTrans, $transaction);
            }

            $this->response->setJsonContent($decryptTrans);
            $this->response->send();        

        } catch (\Exception $e) {            
            $this->exceptionLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function deletePreviousAction($headerId)
    {
        $this->view->disable();

        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        try {
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

        } catch (\Exception $e) {            
            $this->exceptionLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function saveAction()
    {
        $this->view->disable();

        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        try {
            // Record a new header content.
            $transaction = new Transaction();
            $transaction->merchant_header_id = $this->request->getPost('merchant_header_id');
            $transaction->sequence = $this->request->getPost('sequence');
            $transaction->transaction_type_id = $this->request->getPost('transaction_type_id') == '' ? null : $this->request->getPost('transaction_type_id');
            $transaction->region_code = $this->request->getPost('region_code') == '' ? null : $this->request->getPost('region_code');

            //- Encrypt card information
            if ($this->request->getPost('card_number') == '') {
                $transaction->card_number = null;
            } else {
                $transaction->card_number = $this->crypt->encrypt($this->request->getPost('card_number'));
            }        

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
            $transaction->variance_exception = $this->request->getPost('variance_exception') == 'true' || $this->request->getPost('variance_exception') == '1' ? 1 : 0;
            $transaction->other_exception_detail = $this->request->getPost('other_exception_detail') == '' ? null : $this->request->getPost('other_exception_detail');
            $transaction->image_id = $this->request->getPost('image_id') == '' ? null : $this->request->getPost('image_id');
            $transaction->image_file = $this->request->getPost('image_file') == '' ? null : $this->request->getPost('image_file');

            if (!$transaction->save()) {
                echo 0;
            } else {
                echo 1;
            }

        } catch (\Exception $e) {            
            $this->exceptionLogger->error(parent::_constExceptionMessage($e));
        }
    }
    
}
