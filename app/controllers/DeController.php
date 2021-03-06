<?php

class DeController extends ControllerBase
{

    public function initialize()
    {
        $this->tag->setTitle('Data Entry');
        parent::initialize();
    }

    // public function indexAction()
    // {                
    //     if (!$this->request->isPost()) {
    //         $this->flashSession->error('Direct access to data entry URL is not permitted!');
    //         return $this->response->redirect('');
    //     }

    //     $fromEdits = $this->session->get('fromEdits');
    //     // $entryId = $this->session->get('entry_id');
    //     // $batchId = $this->session->get('batch_id');        
        
    //     // try {
    //     //     $entry = DataEntry::findFirstById($entryId); 
    //     //     $batch = Batch::findFirstById($batchId); 
    //         $entry = $this->session->get('entry');
    //         $batch = $this->session->get('batch');

    //         $this->view->dataEntry = $entry;
    //         $this->view->batch = $batch;
    //         $this->view->setTemplateAfter('de');

    //     // } catch (\Exception $e) {    
    //     //     $this->errorLogger->error(parent::_constExceptionMessage($e));
    //     // }

    //     $this->sessionLogger->info($this->session->get('auth')['name'] . ' @ Data Entry page.'); 
    // }

    public function indexAction($batchId = null) // Delete if not needed.
    {        
        $fromEdits = $this->session->get('fromEdits');
        $fromGetNext = $this->session->get('fromGetNext');

        if (!$this->request->isPost()) {
            $this->flashSession->error('Direct access to data entry URL is not permitted!');
            return $this->response->redirect('');
        }

        $userId = $this->session->get('auth')['id'];
        $taskId = $this->session->get('taskId');
        $taskName = $this->session->get('taskName');
        
        if (!$fromGetNext) {
            try {
                // Start a transaction
                $this->db->begin();                 

                // Look for existing activity to maintain single record of batch on a particular task.
                $entry = null;
                if (!$fromEdits) {
                    $entry = DataEntry::findFirst(
                        [
                            "conditions" => "user_id = " . $userId . " AND batch_id = " . $batchId . " AND task_id = " . $taskId . " AND ended_at IS NULL"
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
                    $entry->batch_id = $batchId;
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

                $batch = Batch::findFirstById($batchId); 
                $batch->is_exception = (int) $batch->is_exception;
                
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

                // Commit the transaction
                $this->db->commit();
                
                $this->view->dataEntry = $entry;
                $this->view->batch = $batch;
                $this->view->setTemplateAfter('de');        

                $this->deLogger->info($this->session->get('auth')['name'] . ' performed ' . ($fromEdits ? $taskName . ' Record Edit' : $taskName) . ' on Batch ' .  $batchId . '.'); 

            } catch (\Exception $e) {    
                $this->db->rollback();        
                $this->errorLogger->error(parent::_constExceptionMessage($e));
                
                if (strpos($e->getMessage(), 'Duplicate') !== false) {
                    $this->flashSession->notice('Batch <b>' . $batchId . '</b> was already acquired or currently being processed by a different user. Kindly try another.');
                    return $this->response->redirect('');
                }
            }
        } else {
            $this->view->dataEntry = $this->session->get('entry');
            $this->view->batch = $this->session->get('batch');
            $this->view->setTemplateAfter('de');  
            $this->session->set('fromGetNext', false);      
        }

        $this->sessionLogger->info($this->session->get('auth')['name'] . ' @ Data Entry page.'); 
    }

    public function prepAction()
    {
        $this->view->disable();
        $this->session->set('fromEdits', false);
    }

    public function startAction($batchId)
    {        
        $batch = Batch::findById($batchId); 

        $this->view->batch = $batch;
        $this->view->setTemplateAfter('de');
    }    

    public function completeAction()
    {
        $this->view->disable();

        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        $isSuccess = true;

        try {
            // Start a transaction
            $this->db->begin();

            // Update the DE Activity record
            $entryId = $this->request->getPost('entry_id');
            $batchId = $this->request->getPost('batch_id');        

            $entry = DataEntry::findFirstByid($entryId);
            $entry->ended_at = new \Phalcon\Db\RawValue("NOW()");

            // The DE Activity failed to save, so rollback the transaction
            if (!$entry->save()) {                
                $this->db->rollback();
                $isSuccess = false;

                $this->errorLogger->error('Unable to update activity information ID: ' . $entryId);
                foreach ($dcn->getMessages() as $message) {
                    $this->errorLogger->error($message->getMessage());
                }

                return;
            }

            // Update the Batch status
            $batch = Batch::findFirstByid($batchId);
            $batch->is_exception = (int) $batch->is_exception;

            $taskId = $this->session->get('taskId');

            // Determine task then set status to 'Complete'.
            $task = Task::findFirst($taskId);
            if (strpos($task->name, 'Entry') !== false) {
                $batch->entry_status = 'Complete';
            } else if (strpos($task->name, 'Verify') !== false) {
                $batch->verify_status = 'Complete';
            } else {
                $batch->balance_status = 'Complete';
            }       

            // The Batch failed to save, so rollback the transaction
            if (!$batch->save()) {
                $this->db->rollback();
                $isSuccess = false;
                
                $this->errorLogger->error('Unable to complete Batch ' . $batchId . '.');
                foreach ($dcn->getMessages() as $message) {
                    $this->errorLogger->error($message->getMessage());
                }

                return;

                // foreach ($batch->getMessages() as $message) {
                //     $this->flash->error($message);
                // }

                // $this->dispatcher->forward([
                //     'controller' => "home",
                //     'action' => 'index'
                // ]);

                // return;
            }                                 

            // Record new DCN information.
            $dcn = new Dcn();
            $dcn->task_id = $this->request->getPost('task_id');
            $dcn->batch_id = $this->request->getPost('batch_id');
            $dcn->region_code = $this->request->getPost('region_code');
            $dcn->merchant_number = $this->request->getPost('merchant_number');
            $dcn->dcn = $this->request->getPost('dcn');
            $dcn->amount = $this->request->getPost('amount');
            $dcn->image_path = $this->request->getPost('image_path');
            
            if ($dcn->merchant_number != '' && $dcn->dcn != '' && $dcn->amount != '') {
                if (!$dcn->save()) {

                    $this->db->rollback();
                    $isSuccess = false;

                    $this->errorLogger->error('Unable to log DCN information: ' . json_encode($dcn));
                    foreach ($dcn->getMessages() as $message) {
                        $this->errorLogger->error($message->getMessage());
                    }

                    return;
                } else {
                    // Synchronized DCNs to all previous tasks.
                    $sql = "UPDATE dcn d 
                            SET merchant_number = ?, dcn = ?, amount = ? 
                            WHERE image_path = ?";

                    $this->db->query($sql, [$dcn->merchant_number, $dcn->dcn, $dcn->amount, $dcn->image_path]);     
                    
                    // a:
                    // $prevTask = Task::findFirst('next_task_id = ' . $taskId);            
                    // if ($prevTask) {
                    //     $sql = "UPDATE dcn d 
                    //             INNER JOIN task t ON t.id = d.task_id 
                    //             SET dcn = ?
                    //             WHERE t.next_task_id = ? AND region_code = ? AND merchant_number = ? AND amount = ? AND image_path = ?";

                    //     $this->db->query($sql, [$dcn->dcn, $taskId, $dcn->region_code, $dcn->merchant_number, $dcn->amount, $dcn->image_path]);                
                    //     $taskId = $prevTask->id;
                    //     goto a;
                    // }
                }
            }

            // Commit the transaction
            $this->db->commit();

            $this->deLogger->info($this->session->get('auth')['name'] . ' completed Batch ' . $batchId . ' successfully.');

        } catch (\Exception $e) {      
            $this->db->rollback();
            $isSuccess = false;      
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }

        $this->response->setJsonContent($isSuccess);
        $this->response->send();
    }
    
    public function redirectNoNextAction($taskName)
    {
        $this->flashSession->notice("There are no more available batches for " . $taskName . ".");
        $this->deLogger->info($this->session->get('auth')['name'] . ' requested batch for ' . strtoupper($taskName) . '. No available batch found.'); 
        if ($this->session->get('fromEdits')) {
            return $this->response->redirect('edits');
        } else {
            return $this->response->redirect('home');
        }        
    }

    public function redirectSuccessAction($isSave)
    {
        $this->flashSession->success("Batch was " . ($isSave ? "saved" : "completed") . " successfully.");
        $this->deLogger->info($this->session->get('auth')['name'] . ($isSave ? ' saved' : ' completed') . ' a batch successfully.');
        if ($this->session->get('fromEdits')) {
            return $this->response->redirect('edits');
        } else {
            return $this->response->redirect('home');
        }
    }

}
