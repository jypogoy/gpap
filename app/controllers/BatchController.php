<?php

class BatchController extends ControllerBase
{

    public function initialize() 
    {
        
    }

    // public function beforeExecuteRoute()
	// {
    //     parent::checkSession();
    // }

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
                // $phql = "SELECT * FROM Batch 
                //         WHERE entry_status = 'Complete' AND verify_status IS NULL AND Batch.id NOT IN (
                //             SELECT batch_id 
                //             FROM DataEntry 
                //             WHERE task_id = (SELECT Task.id FROM Task WHERE next_task_id = :taskId:) AND user_id = :userId:
                //         )";
                $phql = "SELECT Batch.* FROM Batch
                        INNER JOIN DataEntry ON DataEntry.batch_id = Batch.id 
                        INNER JOIN Task ON Task.id = DataEntry.task_id
                        WHERE Batch.entry_status = 'Complete' AND Batch.verify_status IS NULL AND Task.next_task_id = :taskId: AND DataEntry.user_id != :userId:";
                
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

    public function getNextAvailableAction($taskId)
    {
        $this->view->disable();
        
        $batch = null;
        $phql = '';
        $conditions = '';        
        $result = null;

        $fromEdits = $this->session->get('fromEdits');
        $userId = $this->session->get('auth')['id'];

        try {                 
            $task = Task::findFirst($taskId);  
            $taskId = $task->id;
            $taskName = $task->name;  
            
            if ($taskName == 'Entry 1') {
                $phql = 'SELECT * FROM Batch WHERE entry_status IS NULL LIMIT 1';
                $result = $this->modelsManager->executeQuery($phql);

            } else if ($taskName == 'Verify') {
                $phql = "SELECT Batch.* FROM Batch
                        INNER JOIN DataEntry ON DataEntry.batch_id = Batch.id 
                        INNER JOIN Task ON Task.id = DataEntry.task_id
                        WHERE Batch.entry_status = 'Complete' AND Batch.verify_status IS NULL AND Task.next_task_id = :taskId: AND DataEntry.user_id != :userId: 
                        LIMIT 1";

                $result = $this->modelsManager->executeQuery(
                    $phql, 
                    [
                        'taskId' => $taskId,
                        'userId' => $userId
                    ]
                );

            } else if ($taskName == 'Balancing') {
                $phql = "SELECT * FROM Batch 
                        WHERE entry_status = 'Complete' AND verify_status = 'Complete' AND balance_status IS NULL AND is_exception = 1 LIMIT 1";
                $result = $this->modelsManager->executeQuery($phql);        
            }          

            if (count($result) > 0) {
                // Assign the available batch to the requestor ----------------------------------------------------------------
                $batch = $result[0];
                $batch->is_exception = (int) $batch->is_exception;

                // Start a transaction
                $this->db->begin();                

                // Look for existing activity to maintain single record of batch on a particular task.
                $entry = null;
                if (!$fromEdits) {
                    $entry = DataEntry::findFirst(
                        [
                            "conditions" => "user_id = " . $userId . " AND batch_id = " . $batch->id . " AND task_id = " . $taskId . " AND ended_at IS NULL"
                        ]
                    );
                } else {
                    $entry = DataEntry::findFirst(
                        [
                            "conditions" => "batch_id = " . $batchId . " AND task_id = " . $taskId
                        ]
                    );
                }

                // Create an activity if nothing has been recorded.
                if (!$entry && !$fromEdits) {            

                    // Write information for data entry activity.
                    $entry = new DataEntry();
                    $entry->user_id = $userId;
                    $entry->batch_id = $batch->id;
                    $entry->task_id = $taskId;

                    if (!$entry->save()) {
                        $this->db->rollback();
                        foreach ($entry->getMessages() as $message) {
                            $this->flash->error($message);
                        }

                        $this->dispatcher->forward([
                            'controller' => "home",
                            'action' => 'index'
                        ]);

                        return;
                    }                                                       
                } 

                // Determine task then set status to 'Doing' or in progress. Only on tasks other than Edits.  
                if (!$fromEdits) {       
                    if (strpos($taskName, 'Entry') !== false) {
                        $batch->entry_status = 'Doing';
                    } else if (strpos($taskName, 'Verify') !== false) {
                        $batch->verify_status = 'Doing';
                    } else {
                        $batch->balance_status = 'Doing';
                    }

                    if (!$batch->save()) {
                        $this->db->rollback();
                        foreach ($batch->getMessages() as $message) {
                            $this->flash->error($message);
                        }

                        $this->dispatcher->forward([
                            'controller' => "home",
                            'action' => 'index'
                        ]);

                        return;
                    }              
                }

                // Make Entry and Batch records persistent for the actual DE.
                $this->session->set('fromGetNext', true);
                $this->session->set('entry', $entry);
                $this->session->set('batch', $batch);

                // Commit the transaction
                $this->db->commit();           
            }
            
            $this->response->setJsonContent($batch);
            $this->response->send(); 

            if ($result && count($result) > 0) $this->deLogger->info($this->session->get('auth')['name'] . ' was given Batch ' . $result[0]->id . ' for ' . strtoupper($taskName) . '.');             

        } catch (\Exception $e) {    
            $this->db->rollback();        
            $this->errorLogger->error(parent::_constExceptionMessage($e));

            // if (strpos($e->getMessage(), 'Duplicate') !== false) {
            //     $this->flashSession->notice('Batch <b>' . $batchId . '</b> was already acquired or currently being processed by a different user. Kindly try another.');
            //     return $this->response->redirect('');
            // }
        }
    }

    public function getNextAvailableAction_DEP($taskId) // For delete is not needed
    {
        $this->view->disable();
        
        $phql = '';
        $conditions = '';        
        $result = null;

        $userId = $this->session->get('auth')['id'];

        try {     
            $task = Task::findFirst($taskId);  
            $taskId = $task->id;
            $taskName = $task->name;  
            
            if ($taskName == 'Entry 1') {
                $phql = 'SELECT * FROM Batch WHERE entry_status IS NULL LIMIT 1';
                $result = $this->modelsManager->executeQuery($phql);

            } else if ($taskName == 'Verify') {
                // $phql = "SELECT * FROM Batch 
                //         WHERE entry_status = 'Complete' AND verify_status IS NULL AND Batch.id NOT IN (
                //             SELECT batch_id 
                //             FROM DataEntry 
                //             WHERE task_id = (SELECT Task.id FROM Task WHERE next_task_id = :taskId:) AND user_id = :userId:
                //         ) LIMIT 1";
                $phql = "SELECT Batch.* FROM Batch
                        INNER JOIN DataEntry ON DataEntry.batch_id = Batch.id 
                        INNER JOIN Task ON Task.id = DataEntry.task_id
                        WHERE Batch.entry_status = 'Complete' AND Batch.verify_status IS NULL AND Task.next_task_id = :taskId: AND DataEntry.user_id != :userId: 
                        LIMIT 1";

                $result = $this->modelsManager->executeQuery(
                    $phql, 
                    [
                        'taskId' => $taskId,
                        'userId' => $userId
                    ]
                );

            } else if ($taskName == 'Balancing') {
                $phql = "SELECT * FROM Batch 
                        WHERE entry_status = 'Complete' AND verify_status = 'Complete' AND balance_status IS NULL AND is_exception = 1 LIMIT 1";
                $result = $this->modelsManager->executeQuery($phql);        
            }          

            $this->response->setJsonContent($result && count($result) > 0 ? $result[0] : $result);
            $this->response->send(); 
        
            if ($result && count($result) > 0) $this->deLogger->info($this->session->get('auth')['name'] . ' was given Batch ' . $result[0]->id . ' for ' . strtoupper($taskName) . '.'); 

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function isAvailableAction()
    {

        $this->view->disable();

        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        $taskId = $this->request->getPost('task_id');
        $batchId = $this->request->getPost('batch_id');

        try {          
            
            $entry = DataEntry::findFirst(
                [
                    'batch_id = ?1 AND task_id = ?2',
                    'bind'  =>  [
                        1   =>  $batchId,
                        2   =>  $taskId
                    ]
                ]
            );
            
            // $task = Task::findFirst($taskId);

            // $batch = true;
            
            // switch ($task->name) {
            //     case 'Entry 1':
            //         $batch = Batch::findFirst(
            //             [
            //                 'id = ?1 AND entry_status IS NULL',
            //                 'bind'  =>  [
            //                     1   =>  $batchId
            //                 ]
            //             ]
            //         );
            //         break;
                
            //     case 'Verify':
            //         $batch = Batch::findFirst(
            //             [
            //                 'id = ?1 AND verify_status IS NULL',
            //                 'bind'  =>  [
            //                     1   =>  $batchId
            //                 ]
            //             ]
            //         );
            //         break;

            //     default:
            //         $batch = Batch::findFirst(
            //             [
            //                 'id = ?1 AND balance_status IS NULL',
            //                 'bind'  =>  [
            //                     1   =>  $batchId
            //                 ]
            //             ]
            //         );
            //         break;
            // }
            
            $this->response->setJsonContent($entry);
            $this->response->send();

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
        
    public function countAvailableAction($taskId)
    {
        $this->view->disable();                

        $result = null;
        $userId = $this->session->get('auth')['id'];

        try {            
            $task = Task::findFirst($taskId);
            $taskName = $task->name;

            if ($taskName == 'Entry 1') {
                $sql = 'SELECT COUNT(*) AS Total FROM batch WHERE entry_status IS NULL';

                $result = $this->db->query($sql);
                $result = $result->fetch(\Phalcon\Db::FETCH_OBJ);

            } else if ($taskName == 'Verify') {
                // $sql = "SELECT COUNT(*) AS Total
                //         FROM batch b
                //         INNER JOIN data_entry de ON de.batch_id = b.id AND de.task_id = (SELECT id FROM task WHERE next_task_id = ?)
                //         WHERE b.entry_status = 'Complete' AND b.verify_status IS NULL AND de.user_id != ?";
                $sql = "SELECT COUNT(*) AS Total
                        FROM batch b
                        INNER JOIN data_entry de ON de.batch_id = b.id 
                        INNER JOIN task t ON t.id = de.task_id
                        WHERE b.entry_status = 'Complete' AND b.verify_status IS NULL AND t.next_task_id = ? AND de.user_id != ?";

                $result = $this->db->query($sql, [$task->id, $userId]);
                $result = $result->fetch(\Phalcon\Db::FETCH_OBJ);

            } else if ($taskName == 'Balancing') {
                $sql = "SELECT COUNT(*) AS Total FROM Batch 
                        WHERE entry_status = 'Complete' AND verify_status = 'Complete' AND balance_status IS NULL AND is_exception = 1";
                
                $result = $this->db->query($sql);
                $result = $result->fetch(\Phalcon\Db::FETCH_OBJ);    
            }          

            $this->response->setJsonContent($result->Total);
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

        // $regionCode = $this->request->getPost('region_code');
        // $recDate = $this->request->getPost('rec_date');
        // $operatorId = $this->request->getPost('operator_id');
        // $sequence = $this->request->getPost('sequence');
        $regionCode = $this->request->getPost('regionCode');
        $zipId = $this->request->getPost('zipId'); 
        $recDate = $this->request->getPost('recDate');

        // Keep reference of the selected job and/or recording date.        
        $this->session->set('zipId', $zipId); 
        $this->session->set('recDate', $recDate); 

        try {
            // $batches = Batch::find(
            //     [
            //         "conditions" => "zip_id = ?1",
            //         "bind"  => [
            //             1   =>  $zipId 
            //         ]
            //     ]
            // );
            // $phql = "SELECT z.region_code, z.rec_date, tt.type, LPAD(z.sequence,3,'0'), b.id 
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
            $sql = "SELECT z.region_code AS region_code, z.rec_date AS rec_date, tt.type AS type, z.operator_id, LPAD(z.sequence,3,'0') AS sequence, SUBSTRING_INDEX(i.path, '/', -1) AS file_name, b.id AS batch_id, a.last_activity, t.id AS task_id
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
                    INNER JOIN image i ON i.batch_id = b.id 
                    WHERE i.is_start" . ($regionCode ? " AND z.region_code = '" . $regionCode . "'" : "") . ($zipId ? " AND b.zip_id = " . $zipId : "") . (strpos($recDate, 'aN') === false ? " AND DATE(b.create_date) = '" . $recDate . "'" : "");
            
            $rows = $this->db->query($sql);
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

