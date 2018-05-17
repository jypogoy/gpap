<?php

class DeController extends ControllerBase
{

    public function initialize()
    {
        $this->tag->setTitle('Data Entry');
        parent::initialize();
    }

    public function indexAction($batchId = null)
    {        
        $fromEdits = $this->session->get('fromEdits');

        if (!$this->request->isPost()) {
            $this->flashSession->error('Direct access to data entry URL is not permitted!');
            return $this->response->redirect('');
        }

        $userId = $this->session->get('auth')['id'];
        $taskId = $this->session->get('taskId');
        $taskName = $this->session->get('taskName');
        
        try {
            $batch = Batch::findFirstById($batchId); 
            $batch->is_exception = (int) $batch->is_exception;
            
            // Determine task then set status to 'Doing' or in progress.            
            if (strpos($taskName, 'Entry') !== false) {
                $batch->entry_status = 'Doing';
            } else if (strpos($taskName, 'Verify') !== false) {
                $batch->verify_status = 'Doing';
            } else {
                $batch->balance_status = 'Doing';
            }

            if (!$batch->save()) {
                foreach ($batch->getMessages() as $message) {
                    $this->flash->error($message);
                }

                $this->dispatcher->forward([
                    'controller' => "home",
                    'action' => 'index'
                ]);

                return;
            }                 

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

            $this->view->dataEntry = $entry;
            $this->view->batch = $batch;
            $this->view->setTemplateAfter('de');        

            $this->deLogger->info($this->session->get('auth')['name'] . ' performed ' . ($fromEdits ? $taskName . ' Record Edit' : $taskName) . ' on Batch ' .  $batchId . '.'); 

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
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
        if (!$this->request->isPost()) {
            return $this->response->redirect('');
        }

        try {
            $entryId = $this->request->getPost('entry_id');
            $batchId = $this->request->getPost('batch_id');        

            $entry = DataEntry::findFirstByid($entryId);
            $entry->ended_at = new \Phalcon\Db\RawValue("NOW()");

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

            $this->deLogger->info($this->session->get('auth')['name'] . ' completed Batch ' . $batchId . ' successfully.');
            return 'Batch <strong>' . $batchId . '</strong> was completed successfully.';

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
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
