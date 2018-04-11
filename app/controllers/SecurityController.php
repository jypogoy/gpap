<?php

class SecurityController extends ControllerBase
{

    public function initialize()
    {

    }

    public function getLastSixPasswordsAction($userId)
    {
        $this->view->disable();

        $passwords = UserPrevPassword::findLastSix(
            'userID = ?',
            [
                $userId
            ]
        ); 

        $this->response->setJsonContent($result);
        $this->response->send();     
    }

    public function passwordChangedSameDayAction()
    {
        $this->view->disable();
    }

    public function passwordDictionaryCheckAction()
    {
        $this->view->disable();
    }

    public function passwordTrivialCheckAction()
    {
        $this->view->disable();
    }

}