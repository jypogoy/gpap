<?php

class CurrencyController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByRegionAction($regionCode)
    {
        $this->view->disable();
        
        try {
            $region = Region::findFirst(
                [
                    "conditions" => "code = '" . $regionCode . "'"
                ]
            );

            $currencies = $region->getCurrency();

            $this->response->setJsonContent($currencies);
            $this->response->send();     

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

}

