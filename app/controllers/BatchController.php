<?php

class BatchController extends ControllerBase
{

    public function initialize() {
        
    }

    public function listByAssignee($userId)
    {
        $batches = Batch::find(
            [
                "conditions" => "is_completed = 0"
            ]
        ); 
    }

    public function listAvailableAction()
    {
        $this->view->disable();
        
        $batches = Batch::find(
            [
                "conditions" => "is_completed = 0"
            ]
        );        

        // $batches = Batch::query()
        //     ->innerJoin('Zip')
        //     ->innerJoin('TransactionType')
        //     ->where('is_completed = 0')
        //     ->execute();

        echo $this->view->partial('batch/listavailable', [ 'batches' => $batches ]);  
    }

    public function getAction($id)
    {
        $this->view->disable();
        
        $batch = Batch::findById($id);

        $this->response->setJsonContent($batch);
        $this->response->send(); 
    }
    
}

