<?php

class DictionaryController extends ControllerBase
{

    public function initialize()
    {

    }

    public function listAction()
    {
        $this->view->disable();

        $dictionary = Dictionary::find();

        $this->response->setJsonContent($dictionary);
        $this->response->send(); 
    }

    public function matchAction($word)
    {
        $this->view->disable();

        try {
            $phql = "SELECT POSITION(dictionaryWord IN '" . $word . "') AS m FROM Dictionary HAVING m = 1";
            
            $result = $this->modelsManager->executeQuery($phql);

            $this->response->setJsonContent($result);
            $this->response->send(); 

        } catch (\Exception $e) {
            $this->exceptionLogger->error($e);
        }
    }

}