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

    public function listByRegionJobAction()
    {
        $this->view->disable();        

        $regionCode = $this->request->getPost('region_code');
        $recDate = $this->request->getPost('rec_date');
        $operatorId = $this->request->getPost('operator_id');
        $sequence = $this->request->getPost('sequence');

        try {
            // $phql = "SELECT z.region_code, z.rec_date, tt.type, LPAD(z.sequence,4,'0'), b.id 
            //         FROM Batch b 
            //         INNER JOIN Zip z ON z.id = b.zip_id 
            //         INNER JOIN TransactionType tt ON tt.id = b.trans_type_id 
            //         WHERE z.region_code = :regCode: AND z.rec_date = :recDate: AND z.operator_id = :optId: AND z.sequence = :seq:";

            // $rows = $this->modelsManager->executeQuery(
            //     $phql,
            //     [
            //         "regCode"   =>  $regionCode,
            //         "recDate"   =>  $recDate,
            //         "optId"     =>  $operatorId,
            //         "seq"       =>  $sequence
            //     ]
            // );        
            $sql = "SELECT z.region_code AS region_code, z.rec_date AS rec_date, tt.type AS type, LPAD(z.sequence,4,'0') as sequence, b.id AS id 
                    FROM batch b 
                    INNER JOIN zip z ON z.id = b.zip_id 
                    INNER JOIN transaction_type tt ON tt.id = b.trans_type_id 
                    WHERE z.region_code = ? AND z.rec_date = ? AND z.operator_id = ? AND z.sequence = ?";

            $result = $this->db->query(
                $sql,
                [
                    $regionCode, $recDate, $operatorId, $sequence
                ]
            );
            $result->setFetchMode(\Phalcon\Db::FETCH_OBJ);
            $rows = $result->fetchAll($result);    

            echo $this->view->partial('edits/partial_batch_list', [ 'rows' => $rows ]);

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }
}

