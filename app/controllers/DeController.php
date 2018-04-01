<?php

class DeController extends ControllerBase
{

    public function initialize()
    {
        $this->tag->setTitle('Data Entry');
        parent::initialize();
    }

    public function indexAction($batchId=null)
    {        
        $batch = Batch::findFirstById($batchId); 

        $userId = $this->session->get('auth')['id'];
        $taskId = $this->session->get('taskId');

        // Write information for data entry activity.
        $entry = new DataEntry();
        $entry->user_id = $userId;
        $entry->batch_id = $batchId;
        $entry->task_id = $taskId;

        if (!$entry->save()) {
            foreach ($task->getMessages() as $message) {
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
            foreach ($task->getMessages() as $message) {
                $this->flash->error($message);
            }

            $this->dispatcher->forward([
                'controller' => "home",
                'action' => 'index'
            ]);

            return;
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

}
