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

        $phql = "SELECT POSITION(dictionaryWord IN '" . $word . "') AS m FROM Dictionary HAVING m = 1";
        //$phql = "SELECT * FROM Dictionary";

        $result = $this->modelsManager->executeQuery($phql);

        $this->response->setJsonContent($result);
        $this->response->send(); 
    }

}