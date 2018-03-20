<?php

class MerchantController extends ControllerBase
{
    public function getAction($id)
    {        
        $merchant = Merchant::findById($id);
        if (!$merchant) {
            $this->flash->notice("The search did not find any merchant.");
        }

        $this->response->setJsonContent($merchant);
        $this->response->send();
        exit;
    }
    
}
