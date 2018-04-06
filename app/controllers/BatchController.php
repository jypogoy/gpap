<?php

class BatchController extends ControllerBase
{

    public function initialize() 
    {
        
    }

    public function exceptionAction()
    {
        $this->view->disable();

        $batchId = $this->request->getPost('batch_id');
        $isException = $this->request->getPost('is_exception');

        $batch = Batch::findFirstById($batchId);    

        $batch->is_exception = $isException == 'true' ? 1 : null;

        echo $batch->save();
    }

    public function listAvailableAction($taskName)
    {
        $this->view->disable();
        
        $batches = Batch::find(
            [
                "conditions" => ($taskName == 'ENTRY' ? "entry_status IS NULL" : "entry_status = 'Complete' AND verify_status IS NULL")
            ]
        );        
    
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
        
        $batches = Batch::findFirst(
            [
                "conditions" => ($taskName == 'ENTRY' ? "entry_status IS NULL" : "entry_status = 'Complete' AND verify_status IS NULL")
            ]
        );        

        $this->response->setJsonContent($batches);
        $this->response->send(); 
    }

    public function countAvailableAction($taskName)
    {
        $this->view->disable();
        
        $count = Batch::count(
            [
                "conditions" => ($taskName == 'ENTRY' ? "entry_status IS NULL" : "entry_status = 'Complete' AND verify_status IS NULL")
            ]
        );        

        $this->response->setJsonContent($count);
        $this->response->send(); 
    }

    public function countWithVarianceAction()
    {
        $this->view->disable();

        $batches = Batch::find(
            [
                "conditions" => "is_exception = 1 AND entry_status = 'Complete' AND verify_status = 'Complete'"
            ]
        );

        $this->response->setJsonContent(count($batches));
        $this->response->send(); 
    }

    public function listWithVarianceAction()
    {
        $this->view->disable();

        $batches = Batch::find(
            [
                "conditions" => "is_exception = 1 AND entry_status = 'Complete' AND verify_status = 'Complete'"
            ]
        );

        echo $this->view->partial('batch/listavailable', [ 'batches' => $batches ]);
    }
}

