<?php

class BatchController extends ControllerBase
{

    public function initialize() {
        
    }

    public function listAvailableAction()
    {
        $this->view->disable();
        
        $batches = Batch::find(
            [
                "conditions" => "is_completed = 0"
            ]
        );        
        
        foreach ($batches as $batch) {
            $batch->zip = "HEY";
            $batch->transactionType = "HELLO";
        }

        // $db = \Phalcon\DI::getDefault()->getShared('db');
        // $query = $db->convertBoundParams('SELECT DISTINCT COUNT(table.id) AS ilosc from table JOIN table2 ON table.klient = :id: AND table2.id = :id:', ['id' => $id]);
        // return $db->fetchAll($query['sql'], \Phalcon\Db::FETCH_OBJ, $query['params']);

        $this->response->setJsonContent($batches);
        $this->response->send();     
    }

}

