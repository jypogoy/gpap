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
        $batch = Batch::findFirstById($batchId); 

        $userId = $this->session->get('auth')['id'];
        $taskId = $this->session->get('taskId');

        // Look for existing activity to maintain single record of batch on a particular task.
        $existingEntry = DataEntry::findFirst(
            [
                "conditions" => "user_id = " . $userId . " AND batch_id = " . $batchId . " AND task_id = " . $taskId . " AND ended_at IS NULL"
            ]
        );

        // Create an activity if nothing has been recorded.
        if (!$existingEntry) {            

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
            
            // Determine task then set status to 'Doing' or in progress.
            $task = Task::findFirst($taskId);
            if (strpos($task->name, 'Entry') !== false) {
                $batch->entry_status = 'Doing';
            } else {
                $batch->verify_status = 'Doing';
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
        }

        $this->view->batch = $batch;
        $this->view->setTemplateAfter('de');
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

        $entryId = $this->request->getPost('entry_id');
        $batchId = $this->request->getPost('batch_id');        

        $entry = DataEntry::findById($entryId);
        $entry->ended_at = new \Phalcon\Db\RawValue("NOW()");

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

        $batch = Batch::findById($batchId);

        $taskId = $this->session->get('taskId');

        // Determine task then set status to 'Complete'.
        $task = Task::findFirst($taskId);
        if (strpos($task->name, 'Entry') !== false) {
            $batch->entry_status = 'Complete';
        } else {
            $batch->verify_status = 'Complete';
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

        if ($this->request->getPost('isFromHome')) {
            $this->flash->success("Batch <b>" . $batchId . "</b>  was completed successfully.");
            $this->dispatcher->forward([
                'controller' => "home",
                'action' => 'index'
            ]);
        }
    }
    
    public function redirectNoNextAction($taskName)
    {
        $this->flashSession->success("There are no more available batches for " . $taskName);
        return $this->response->redirect('home');
    }

    public function redirectSuccessAction($isSave)
    {
        $this->flashSession->success("Batch was " . ($isSave ? "saved" : "completed") . " successfully.");
        return $this->response->redirect('home');
    }

}
