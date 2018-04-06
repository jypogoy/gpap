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

        $phql = "SELECT COUNT(*) AS total FROM Transaction " .
                "INNER JOIN MerchantHeader ON MerchantHeader.id = Transaction.merchant_header_id " . 
                "INNER JOIN Batch ON Batch.id =  MerchantHeader.batch_id " .
                "WHERE Transaction.variance_exception = 1 AND Batch.entry_status = 'Complete' AND Batch.verify_status = 'Complete' " .
                "GROUP BY Batch.id";

        $count = $this->modelsManager->executeQuery($phql)->getFirst();

        $this->response->setJsonContent($count);
        $this->response->send(); 
    }

    public function listWithVarianceAction()
    {
        $this->view->disable();

        $phql = "SELECT Batch.* FROM Transaction " .
                "INNER JOIN MerchantHeader ON MerchantHeader.id = Transaction.merchant_header_id " . 
                "INNER JOIN Batch ON Batch.id =  MerchantHeader.batch_id " .
                "WHERE Transaction.variance_exception = 1 AND Batch.entry_status = 'Complete' AND Batch.verify_status = 'Complete' ";
                //"GROUP BY Batch.id";

        $batches = $this->modelsManager->executeQuery($phql);

        echo $this->view->partial('batch/listavailable', [ 'batches' => $batches ]);
    }
}

