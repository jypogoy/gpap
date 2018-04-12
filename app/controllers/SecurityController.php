<?php

class SecurityController extends ControllerBase
{

    public function initialize()
    {

    }

    public function getLastSixPasswordsAction($userId)
    {
        $this->view->disable();

        try {
            $passwords = UserPrevPassword::findLastSix(
                'userID = ?',
                [
                    $userId
                ]
            ); 

            $this->response->setJsonContent($result);
            $this->response->send();     
            
        } catch (\Exception $e) {            
            $this->exceptionLogger->error(parent::_constExceptionMessage($e));
        }
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

    public function updatePasswordAction()
    {
        // if (!$this->request->isPost()) {
        //     $this->flashSession->error('Cannot update password using URL!');
        //     return $this->response->redirect('');
        // }

        $validator = new PasswordValidator();
        $messages = $validator->validate($_POST);

        $this->view->messages = $messages;

        foreach ($messages as $message) {
            $this->flashSession->error($message);
        }

        return $this->dispatcher->forward(
            [
                "controller" => "session",
                "action"     => "changepassword"
            ]
        );    

        $password = $this->request->getPost('password');
        
        try {
            $user = new User();
            // Store the password hashed
            $user->password = $this->security->hash($password);

            if (!$user->save()) {
                foreach ($user->getMessages() as $message) {
                    $this->flash->error($message);
                }

                $this->dispatcher->forward([
                    'ontroller' => 'session',
                    'action'    => 'changepassword'
                ]);

                return;
            }

            $this->sessionLogger->info($this->session->get('auth')['name'] . ' changed password.'); 

        }catch (\Exception $e) {            
            $this->exceptionLogger->error(parent::_constExceptionMessage($e));
        }
    }
}