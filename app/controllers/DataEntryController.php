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
                "conditions" => "user_id = " . $userId . " AND task_id = " . $taskId,
                "order"      => "started_at DESC"   
            ]
        );

        echo $this->view->partial('home/user_de_list', [ 'entries' => $entries ]);  
    }

}

