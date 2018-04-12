<?php

class DictionaryController extends ControllerBase
{

    public function initialize()
    {
        $this->view->disable();
    }

    public function listAction()
    {
        try {
            $dictionary = Dictionary::find();

            $this->response->setJsonContent($dictionary);
            $this->response->send(); 

        } catch (\Exception $e) {
            $this->exceptionLogger->error($e);
        }
    }

    public function matchAction($word)
    {
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