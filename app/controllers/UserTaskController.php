<?php

class UserTaskController extends ControllerBase
{

    public function initialize() {
        
    }

    // public function beforeExecuteRoute()
	// {
    //     parent::checkSession();
    // }

    public function getByUserAction($userId)
    {
        $this->view->disable();
        
        try {
            $userTasks = UserTask::find(
                [
                    "conditions" => "user_id = " . $userId
                ]
            );

            echo $this->view->partial('home/user_tasks_selection', [ 'userTasks' => $userTasks ]);

        } catch (\Exception $e) {            
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

}

