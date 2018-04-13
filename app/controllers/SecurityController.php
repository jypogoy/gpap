<?php

class SecurityController extends ControllerBase
{

    public function initialize()
    {

    }

    /**
     * Retrieves most recent six passwords of a user.
     */
    public function checkByLastSixPasswordsAction($newPassword)
    {
        $this->view->disable();        
        $userId = $this->session->get('auth')['id'];
        $hasMatch = false;

        try {
            $passwords = User::findLastSixPasswords(
                'userID = ?',
                [
                    $userId,
                    $userId
                ]
            ); 

            // Match new password hash with the recorded passwords.
            $encNewPassword = $this->security->hash($newPassword);            
            foreach ($passwords as $password) {
                if($this->security->checkHash($encNewPassword, $password->userPassword)) {
                    $hasMatch = true;
                    break;
                }
            }

            $this->response->setJsonContent($hasMatch);
            $this->response->send();     
            
        } catch (\error $e) {            
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }

    /**
     * Retrieves count of passwords made within the day.
     */
    public function passwordChangedSameDayAction($userId)
    {
        $this->view->disable();

        try {
            $passwords = User::find(
                [
                    "conditions" => "DATEDIFF(now(),userLastPasswordChange) = 0 AND userID = ?1",
                    "bind"       => [
                        1   =>  $userId
                    ]
                ]
            );
                                    
            $this->response->setJsonContent(count($passwords));
            $this->response->send();     
            
        } catch (\error $e) {            
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }

    /**
     * Retrieves count of matching words from the dictionary.
     */
    public function passwordDictionaryCheckAction($password)
    {
        $this->view->disable();

        try {
            $passwords = User::passwordDictCheck(
                [
                    $password, $password, $password, $password
                ]
            );
                                    
            $this->response->setJsonContent(count($passwords));
            $this->response->send();     
            
        } catch (\error $e) {            
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }

    /**
     * Retrieves count any matching trivial words from the dictionary.
     */
    public function passwordTrivialCheckAction($password)
    {
        $this->view->disable();

        try {
            $passwords = User::trivialCheck(
                [
                    $password, $password, $password, $password
                ]
            );
                                    
            $this->response->setJsonContent(count($passwords));
            $this->response->send();     
            
        } catch (\error $e) {            
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }

    /**
     * Validates if password is same with personal information such as first and last name.
     */
    public function passwordPersonalInfoCheckAction($password)
    {
        $this->view->disable();

        try {
            $passwords = User::personalInfoCheck(
                [
                    $password
                ]
            );

            $this->response->setJsonContent(count($passwords));
            $this->response->send();   

        } catch (\error $e) {
            $this->errorLogger->error($e);
        }
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

        }catch (\error $e) {            
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }
}