<?php

class BatchController extends ControllerBase
{

    public function initialize() 
    {
        
    }

    public function exceptionAction()
    {
        $this->view->disable();

        try {
            $batchId = $this->request->getPost('batch_id');
            $isException = $this->request->getPost('is_exception');

            $batch = Batch::findFirstById($batchId);    

            $batch->is_exception = $isException == 'true' ? 1 : null;

            $result = $batch->save();

            if (!$result) {
                foreach ($batch->getMessages() as $message) {
                    $this->logger->error('BatchController->exception, Error: ' . '');
                }            
            }

            echo $result;
        
        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function listAvailableAction($taskName)
    {
        $this->view->disable();
        
        try {
            $batches = Batch::find(
                [
                    "conditions" => ($taskName == 'ENTRY' ? "entry_status IS NULL" : "entry_status = 'Complete' AND verify_status IS NULL")
                ]
            );        
        
            echo $this->view->partial('batch/listavailable', [ 'batches' => $batches ]);  

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function getAction($id)
    {
        $this->view->disable();
        
        try {
            $batch = Batch::findById($id);

            $this->response->setJsonContent($batch);
            $this->response->send(); 
            
        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }
    
    public function getAvailableAction($taskName)
    {
        $this->view->disable();
        
        $conditions = '';        
        if ($taskName == 'Entry 1') {
            $conditions = "entry_status IS NULL";
        } else if ($taskName == 'Verify') {
            $conditions = "entry_status = 'Complete' AND verify_status IS NULL";
        } else if ($taskName == 'Balancing') {
            $conditions = "entry_status = 'Complete' AND verify_status = 'Complete' AND balance_status IS NULL AND is_exception = 1";
        }

        try {
            $batches = Batch::findFirst(
                [
                    "conditions" => $conditions
                ]
            );        

            $this->response->setJsonContent($batches);
            $this->response->send(); 
        
            $this->deLogger->info($this->session->get('auth')['name'] . ' requested another batch for ' . strtoupper($taskName) . '.'); 

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function countAvailableAction($taskName)
    {
        $this->view->disable();
        
        try {
            $count = Batch::count(
                [
                    "conditions" => ($taskName == 'ENTRY' ? "entry_status IS NULL" : "entry_status = 'Complete' AND verify_status IS NULL")
                ]
            );        

            $this->response->setJsonContent($count);
            $this->response->send(); 

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function countWithVarianceAction()
    {
        $this->view->disable();

        try {
            $batches = Batch::find(
                [
                    "conditions" => "is_exception = 1 AND entry_status = 'Complete' AND verify_status = 'Complete' AND balance_status IS NULL"
                ]
            );

            $this->response->setJsonContent(count($batches));
            $this->response->send(); 

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function listWithVarianceAction()
    {
        $this->view->disable();

        try {
            $batches = Batch::find(
                [
                    "conditions" => "is_exception = 1 AND entry_status = 'Complete' AND verify_status = 'Complete' AND balance_status IS NULL"
                ]
            );

            echo $this->view->partial('batch/listavailable', [ 'batches' => $batches ]);

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function listByRegion()
    {
        
    }
}

