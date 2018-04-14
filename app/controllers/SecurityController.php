<?php

class SecurityController extends ControllerBase
{

    public function initialize()
    {

    }

    /**
     * Retrieves most recent six passwords of a user.
     */
    public function checkByLastSixPasswordsAction($password)
    {
        //$this->view->disable();        
        $userId = $this->session->get('auth')['id'];
        //$password = $this->request->getPost('password');        
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
            $encPassword = $this->security->hash($password);            
            foreach ($passwords as $password) {
                if($this->security->checkHash($encPassword, $password->userPassword)) {
                    $hasMatch = true;
                    break;
                }
            }

            return $hasMatch;
            // $this->response->setJsonContent($hasMatch);
            // $this->response->send();     
            
        } catch (\error $e) {            
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }

    /**
     * Retrieves count of passwords made within the day.
     */
    public function passwordChangedSameDayAction()
    {
        $userId = $this->session->get('auth')['id'];

        try {
            $passwords = User::find(
                [
                    "conditions" => "DATEDIFF(now(),userLastPasswordChange) = 0 AND userID = ?1",
                    "bind"       => [
                        1   =>  $userId
                    ]
                ]
            );
               
            return count($passwords) > 0 ? true : false;
            
        } catch (\error $e) {            
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }

    /**
     * Retrieves count of matching words from the dictionary.
     */
    public function passwordDictionaryCheckAction($password)
    {
        //$this->view->disable();
        try {
            $sql = "SELECT dictionary.* 
                    FROM dictionary 
                    WHERE isCommon = true AND (INSTR(BINARY LOWER(?), LOWER(dictionaryWord))) > 0
                    OR INSTR(REVERSE(BINARY LOWER(?)), REVERSE(LOWER(dictionaryWord))) > 0 
                    OR INSTR(REVERSE(BINARY LOWER(?)),LOWER(dictionaryWord)) > 0 
                    OR INSTR(LOWER(?), REVERSE(LOWER(dictionaryWord))) > 0";    
            
            $result = $this->db->query($sql, [$password, $password, $password, $password]);    
            
            $result->setFetchMode(
                \Phalcon\Db::FETCH_NUM
            );

            $results = $result->fetchArray()[0];      

            return $results && $results != "0" ? true : false;
            
        } catch (\error $e) {            
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }

    /**
     * Retrieves count any matching trivial words from the dictionary.
     */
    public function passwordTrivialCheckAction($password)
    {
        try {
            $sql = "SELECT count(dictionaryid) 
                    FROM dictionary 
                    WHERE isCommon = false 
                    AND (INSTR(BINARY LOWER(?), LOWER(dictionaryWord))) > 0
                    OR INSTR(REVERSE(BINARY LOWER(?)), REVERSE(LOWER(dictionaryWord)))> 0 
                    OR INSTR(REVERSE(BINARY LOWER(?)),LOWER(dictionaryWord))> 0 
                    OR INSTR(LOWER(?), REVERSE(LOWER(dictionaryWord)))> 0";    

            $result = $this->db->query($sql, [$password, $password, $password, $password]);    

            $result->setFetchMode(
                \Phalcon\Db::FETCH_NUM
            );

            $results = $result->fetchArray()[0];      

            return $results && $results != "0" ? true : false;

        } catch (\error $e) {            
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }

    /**
     * Validates if password is same with personal information such as first and last name.
     */
    public function passwordPersonalInfoCheckAction($password)
    {
        //$this->view->disable();
        try {
            $sql = "SELECT POSITION(userID IN '?') AS m1, POSITION(userName IN '?') AS m2, POSITION(userLastName IN '?') AS m3, POSITION(userFirstName IN '?') AS m4 FROM user HAVING m1 > 0 OR m2 > 0 OR m3 > 0 OR m4 > 0";    

            $result = $this->db->query($sql, [$password, $password, $password, $password]);    
            
            $result->setFetchMode(
                \Phalcon\Db::FETCH_OBJ
            );

            $r = $result->numRows();

            $results = $result->fetchArray()[0];      

            return $results && $results != "0" ? true : false;

        } catch (\error $e) {
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }

    public function updatePasswordAction()
    {
        // if (!$this->request->isPost()) {
        //     $this->flashSession->error('Cannot update password using URL!');
        //     return $this->response->redirect('');
        // }

        // $validator = new PasswordValidator();
        // $messages = $validator->validate($_POST);

        // $this->view->messages = $messages;

        // foreach ($messages as $message) {
        //     $this->flashSession->error($message);
        // }

        // return $this->dispatcher->forward(
        //     [
        //         "controller" => "session",
        //         "action"     => "changepassword"
        //     ]
        // );    
            $this->view->disable();
        $userId = $this->session->get('auth')['id'];

        $currentPassword = $this->request->getPost('current_password');
        $newPassword = $this->request->getPost('new_password');
        $confirmPassword = $this->request->getPost('confirm_password');
        
        try {
            
            $used = self::checkByLastSixPasswordsAction($newPassword);
            if ($used) {
                $this->flashSession->error('Password is already used.');
            }

            $changedToday = self::passwordChangedSameDayAction();
            if ($changedToday) {
                $this->flashSession->error('Cannot change password anymore.');
            }

            $inDictionary = self::passwordDictionaryCheckAction($newPassword);
            if ($inDictionary) {
                $this->flashSession->error('Password should not contain common dictionary words.');
            }

            $isTrivial = self::passwordTrivialCheckAction($newPassword);
            if ($isTrivial) {
                $this->flashSession->error('Password should not contain trivial words.');
            }

            $isPersonal = self::passwordPersonalInfoCheckAction($newPassword);
            if ($isPersonal) {
                $this->flashSession->error('Password should not contain personal information. i.e. usernames, names.');
            }

            if ($used || $changedToday || $inDictionary || $isTrivial || $isPersonal) {
                $this->response->redirect('session/changepassword');
                return;
            }
                        
            $user = User::findFirstByUserID($userId);
            
            // Store the password hashed
            $user->password = $this->security->hash($newPassword);

            $query = $this->modelsManager->createQuery("UPDATE User SET userPassword = :pass:, userLastPasswordChange = NOW(), createdBy = :creatUserId: WHERE userID = :userId:");

            $result = $query->execute(array(
                'pass' => $this->security->hash($newPassword),
                'creatUserId' => $userId,
                'userId' => $userId                
            ));

            // if (!$user->save()) {
            //     foreach ($user->getMessages() as $message) {
            //         $this->flash->error($message);
            //     }

            //     $this->dispatcher->forward([
            //         'controller' => 'session',
            //         'action'    => 'changepassword'
            //     ]);

            //     return;
            // }

            $msg = 'Your password was updated successfully!';
            $this->flashSession->success($msg);    
            $this->response->redirect('home');

            $this->sessionLogger->info($this->session->get('auth')['name'] . ' changed password.'); 

        }catch (\error $e) {            
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }
}