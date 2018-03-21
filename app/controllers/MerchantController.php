<?php

class MerchantController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getAction($merchantId)
    {                
        $this->view->disable();
        
        $merchant = Merchant::findFirst(
            [
                "conditions" => "account_number = " . $merchantId
            ]
        );

        $this->response->setJsonContent($merchant);
        $this->response->send();        
    }
    
}
