<?php

class DataEntryController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByUserTaskAction($taskId)
    {
        $this->view->disable();

        $task = Task::findFirst($taskId);
        $this->session->set('taskId', $taskId); // Keep reference of the selected task.        
        $this->session->set('taskName', $task->name);    

        $userId = $this->session->get('auth')['id'];
        
        $entries = DataEntry::find(
            [
                "conditions" => "user_id = " . $userId . " AND task_id = " . $taskId . " AND ended_at IS NULL",
                "order"      => "started_at DESC"   
            ]
        );

        echo $this->view->partial('home/user_de_list', [ 'entries' => $entries ]);  
    }

    public function getByCounterTaskAction()
    {
        $this->view->disable();

        $batchId = $this->request->getPost('batch_id');
        $taskId = $this->request->getPost('task_id');

        $entry = DataEntry::findFirst(
            [
                "conditions" => "batch_id = " . $batchId . " AND task_id != " . $taskId    
            ]
        );

        $this->response->setJsonContent($entry);
        $this->response->send();      
    }

}

