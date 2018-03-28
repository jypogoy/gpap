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
                "conditions" => "merchant_header_id = " . $headerId
            ]
        );

        $this->response->setJsonContent($transactions);
        $this->response->send();        
    }
    
}
