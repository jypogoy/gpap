<?php

class CurrencyController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByRegionAction($regionCode)
    {
        $this->view->disable();
        
        try {
            $phql = "SELECT Currency.* 
                    FROM Currency 
                    JOIN RegionCurrency rc 
                    WHERE rc.region_code = '$regionCode' 
                    ORDER BY Currency.alpha_code";

            $currencies = $this->modelsManager->executeQuery($phql);

            $this->response->setJsonContent($currencies);
            $this->response->send();     

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function getByAlphaCodeAction($alphaCode)
    {
        $this->view->disable();

        try {
            $currency = Currency::findFirstByAlphaCode($alphaCode);

            $this->response->setJsonContent($currency);
            $this->response->send();     

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

}

