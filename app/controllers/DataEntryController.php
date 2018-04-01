<?php

class DataEntryController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByUserTaskAction($taskId)
    {
        $this->view->disable();
        $this->session->set('taskId', $taskId); // Keep reference of the selected task.
        
        $userId = $this->session->get('auth')['id'];
        
        $entries = DataEntry::find(
            [
                "conditions" => "user_id = " . $userId . " and task_id = " . $taskId
            ]
        );

        echo $this->view->partial('home/user_de_list', [ 'entries' => $entries ]);  
    }

}

