<?php

class MerchantController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getAction($merchantId)
    {                
        $this->view->disable();
        
        try {
            $merchant = Demographic::findFirst(
                [
                    "conditions" => "merchant = " . $merchantId
                ]
            );
        
            $this->response->setJsonContent($merchant);
            $this->response->send();     
        
        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }   
    }
    
}
