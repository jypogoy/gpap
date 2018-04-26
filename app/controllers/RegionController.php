<?php

class RegionController extends \Phalcon\Mvc\Controller
{

    public function listAction()
    {
        $this->view->disable();

        try {
            $regions = Region::find();

            $this->response->setJsonContent($regions);
            $this->response->send();     

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

}

