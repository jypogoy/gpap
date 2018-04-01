<?php

class BatchController extends ControllerBase
{

    public function initialize() 
    {
        
    }

    public function listAvailableAction($taskName)
    {
        $this->view->disable();
        
        $batches = Batch::find(
            [
                "conditions" => ($taskName == 'ENTRY' ? "entry_status IS NULL" : "entry_status = 'Complete' AND verify_status IS NULL")
            ]
        );        

        // $batches = Batch::query()
        //     ->innerJoin('Zip')
        //     ->innerJoin('TransactionType')
        //     ->where('is_completed =i 0')
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
    
    public function getAvailableAction($taskName)
    {
        $this->view->disable();
        
        $batch = Batch::findFirst(
            [
                "conditions" => ($taskName == 'ENTRY' ? "entry_status IS NULL" : "entry_status = 'Complete' AND verify_status IS NULL")
            ]
        );        

        $this->response->setJsonContent($batch);
        $this->response->send(); 
    }
}

