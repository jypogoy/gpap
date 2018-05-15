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

    public function listAvailableAction()
    {
        $this->view->disable();
        
        $phql = '';
        $conditions = '';        
        $batches = null;

        $taskId = $this->request->getPost('task_id');
        $taskName = $this->request->getPost('task_name');
        $userId = $this->request->getPost('user_id');

        try {            
            if ($taskName == 'Entry 1') {
                $phql = 'SELECT * FROM Batch WHERE entry_status IS NULL';
                $batches = $this->modelsManager->executeQuery($phql);

            } else if ($taskName == 'Verify') {
                $phql = "SELECT * FROM Batch 
                        WHERE entry_status = 'Complete' AND verify_status IS NULL AND Batch.id NOT IN (
                            SELECT batch_id 
                            FROM DataEntry 
                            WHERE task_id = (SELECT Task.id FROM Task WHERE next_task_id = :taskId:) AND user_id = :userId:
                        )";
                $batches = $this->modelsManager->executeQuery(
                    $phql, 
                    [
                        'taskId' => $taskId,
                        'userId' => $userId
                    ]
                );

            } else if ($taskName == 'Balancing') {
                $phql = "SELECT * FROM Batch 
                        WHERE entry_status = 'Complete' AND verify_status = 'Complete' AND balance_status IS NULL AND is_exception = 1";
                $batches = $this->modelsManager->executeQuery($phql);        
            }          

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
        $batches = null;

        $taskId = $this->request->getPost('task_id');
        $taskName = $this->request->getPost('task_name');
        $userId = $this->request->getPost('user_id');

        try {
            $phql = '';
            if ($taskName == 'Entry 1') {
                $phql = 'SELECT * FROM Batch WHERE entry_status IS NULL';
                $batches = $this->modelsManager->executeQuery($phql);

            } else if ($taskName == 'Verify') {
                $phql = "SELECT Batch.*
                        FROM Batch
                        INNER JOIN DataEntry ON DataEntry.batch_id = Batch.id AND DataEntry.task_id = (SELECT id FROM Task WHERE next_task_id = :taskId:)
                        WHERE Batch.entry_status = 'Complete' AND Batch.verify_status IS NULL AND DataEntry.user_id != :userId:";
                        
                $batches = $this->modelsManager->executeQuery(
                    $phql, 
                    [
                        'taskId' => $taskId,
                        'userId' => $userId
                    ]
                );

            } else if ($taskName == 'Balancing') {
                $phql = "SELECT * FROM Batch 
                        WHERE entry_status = 'Complete' AND verify_status = 'Complete' AND balance_status IS NULL AND is_exception = 1";
                $batches = $this->modelsManager->executeQuery($phql);        
            }            

            $this->response->setJsonContent($batches);
            $this->response->send(); 
        
            $this->deLogger->info($this->session->get('auth')['name'] . ' requested another batch for ' . strtoupper($taskName) . '.'); 

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function countAvailableAction()
    {
        $this->view->disable();
        
        $phql = '';
        $conditions = '';        
        $count = 0;

        $taskId = $this->request->getPost('task_id');
        $taskName = $this->request->getPost('task_name');
        $userId = $this->request->getPost('user_id');

        try {            
            if ($taskName == 'Entry 1') {
                $phql = 'SELECT COUNT(*) FROM Batch WHERE entry_status IS NULL';
                $count = $this->modelsManager->executeQuery($phql);

            } else if ($taskName == 'Verify') {
                $phql = "SELECT COUNT(*)
                        FROM Batch
                        INNER JOIN DataEntry ON DataEntry.batch_id = Batch.id AND DataEntry.task_id = (SELECT Task.id FROM Task WHERE next_task_id = :taskId:)
                        WHERE Batch.entry_status = 'Complete' AND Batch.verify_status IS NULL AND DataEntry.user_id != :userId:";

                $count = $this->modelsManager->executeQuery(
                    $phql, 
                    [
                        'taskId' => $taskId,
                        'userId' => $userId
                    ]
                );

            } else if ($taskName == 'Balancing') {
                $phql = "SELECT COUNT(*) FROM Batch 
                        WHERE entry_status = 'Complete' AND verify_status = 'Complete' AND balance_status IS NULL AND is_exception = 1";
                $count = $this->modelsManager->executeQuery($phql);        
            }          

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

    public function listByRegionJobAction($zipId)
    {
        $this->view->disable();        

        // $regionCode = $this->request->getPost('region_code');
        // $recDate = $this->request->getPost('rec_date');
        // $operatorId = $this->request->getPost('operator_id');
        // $sequence = $this->request->getPost('sequence');

        $this->session->set('zipId', $zipId); // Keep reference of the selected job.        

        try {
            // $batches = Batch::find(
            //     [
            //         "conditions" => "zip_id = ?1",
            //         "bind"  => [
            //             1   =>  $zipId 
            //         ]
            //     ]
            // );
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
            $sql = "SELECT z.region_code AS region_code, z.rec_date AS rec_date, tt.type AS type, z.operator_id, LPAD(z.sequence,4,'0') as sequence, b.id AS batch_id, a.last_activity, t.id as task_id
                    FROM batch b 
                    INNER JOIN zip z ON z.id = b.zip_id 
                    INNER JOIN transaction_type tt ON tt.id = b.trans_type_id 
                    INNER JOIN (
                        SELECT DISTINCT b.id, CASE WHEN balance_status = 'Complete' 
                                    THEN 'Balancing' 
                                ELSE 
                                    CASE WHEN verify_status = 'Complete' 
                                        THEN 'Verify' 
                                    ELSE
                                        CASE WHEN entry_status = 'Complete' 
											THEN 'Entry 1' 
										ELSE
											'-'
										END
                                    END 
                                END AS last_activity
                        FROM batch b
                        INNER JOIN task t
                    ) AS a ON a.id = b.id 
                    LEFT JOIN task t ON t.name = a.last_activity
                    WHERE b.zip_id = ?";

            $rows = $this->db->query(
                $sql,
                [
                    $zipId
                ]
            );
            $rows->setFetchMode(\Phalcon\Db::FETCH_OBJ);
            $rows = $rows->fetchAll($rows);    

            echo $this->view->partial('edits/partial_batch_list', [ 'rows' => $rows ]);

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function getPrevOperatorAction()
    {
        $this->view->disable();

        $batchId = $this->request->getPost('batch_id');
        $nextTaskId = $this->request->getPost('task_id');

        $sql = "SELECT u.userfirstname AS first_name, u.userlastname AS last_name 
                FROM data_entry de 
                INNER JOIN task t ON t.next_task_id = ?
                INNER JOIN user u ON u.userid = de.user_id 
                WHERE de.batch_id = ?";

        $result = $this->db->query($sql, [$nextTaskId, $batchId]);
        $result->setFetchMode(\Phalcon\Db::FETCH_OBJ);
        $rows = $result->fetchAll($result);            

        $this->response->setJsonContent($rows[0]);
        $this->response->send();   
    }

    public function getKeyerAction($batchId)
    {
        $this->view->disable();

        try {            
            $sql = "SELECT userFirstName AS first_name, userLastName AS last_name
                    FROM data_entry de
                    INNER JOIN task t ON t.id = de.task_id
                    INNER JOIN user u ON u.userID = de.user_id
                    WHERE t.name = 'Entry 1' AND de.batch_id = ?";

            $result = $this->db->query($sql, [$batchId]);
            $result = $result->fetch(\Phalcon\Db::FETCH_OBJ);       

            $this->response->setJsonContent($result);
            $this->response->send();

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function getVerifierAction($batchId)
    {
        $this->view->disable();

        try {            
            $sql = "SELECT userFirstName AS first_name, userLastName AS last_name
                    FROM data_entry de
                    INNER JOIN task t ON t.id = de.task_id
                    INNER JOIN user u ON u.userID = de.user_id
                    WHERE t.name = 'Verify' AND de.batch_id = ?";

            $result = $this->db->query($sql, [$batchId]);
            $result = $result->fetch(\Phalcon\Db::FETCH_OBJ);       

            $this->response->setJsonContent($result);
            $this->response->send();

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function getBalancerAction($batchId)
    {
        $this->view->disable();

        try {            
            $sql = "SELECT userFirstName AS first_name, userLastName AS last_name
                    FROM data_entry de
                    INNER JOIN task t ON t.id = de.task_id
                    INNER JOIN user u ON u.userID = de.user_id
                    WHERE t.name = 'Balancing' AND de.batch_id = ?";

            $result = $this->db->query($sql, [$batchId]);
            $result = $result->fetch(\Phalcon\Db::FETCH_OBJ);       

            $this->response->setJsonContent($result);
            $this->response->send();

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }
}

