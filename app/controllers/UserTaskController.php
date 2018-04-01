<?php

class UserTaskController extends ControllerBase
{

    public function initialize() {
        
    }

    public function getByUserAction($userId)
    {
        $this->view->disable();
        
        $userTasks = UserTask::find(
            [
                "conditions" => "user_id = " . $userId
            ]
        );

        echo $this->view->partial('home/user_tasks_selection', [ 'userTasks' => $userTasks ]);
    }

}

