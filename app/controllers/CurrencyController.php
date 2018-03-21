<?php

class CurrencyController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByRegionAction($regionCode)
    {
        $this->view->disable();
        
        $region = Region::findFirst(
            [
                "conditions" => "code = '" . $regionCode . "'"
            ]
        );

        $currencies = $region->getCurrency();

        $this->response->setJsonContent($currencies);
        $this->response->send();     
    }

}

