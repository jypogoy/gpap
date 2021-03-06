<?php

class SecurityController extends ControllerBase
{
    
    public function initialize()
    {

    }

    public function updatePasswordAction()
    {      
        if (!$this->request->isPost()) {
            $this->flashSession->error('Cannot update password using URL!');
            return $this->response->redirect('');
        }

        $userId = $this->session->get('auth')['id'];

        $currentPassword = $this->request->getPost('current_password');
        $newPassword = $this->request->getPost('new_password');
        $confirmPassword = $this->request->getPost('confirm_password');

        try {

            $validPass = self::isPasswordValid($currentPassword);
            if (!$validPass) {
                $this->session->set('currentPassword', $currentPassword);
                $this->session->set('newPassword', $newPassword);
                $this->session->set('confirmPassword', $confirmPassword);
                
                $this->flashSession->error('Your current password is invalid!');
                $this->response->redirect('session/changepassword');
                return;
            }    

            $same = self::isCurrNewPasswordSame($currentPassword, $newPassword);
            if ($same) {
                $this->session->set('currentPassword', $currentPassword);
                $this->session->set('newPassword', $newPassword);
                $this->session->set('confirmPassword', $confirmPassword);
                
                $this->flashSession->error('Your existing and new passwords must not be the same!');
                $this->response->redirect('session/changepassword');
                return;
            }

            // $used = self::isLastSixMatch($newPassword);
            // if ($used) {
            //     $this->flashSession->error('Password is already used.');
            // }

            $changedToday = self::isUpdatedToday();
            if ($changedToday && !$this->session->get('initLogin')) {
                $this->flashSession->error('You can only change password once a day.');
            }

            $inDictionary = self::isDictMatch($newPassword);
            if ($inDictionary) {
                $this->flashSession->error('Password should not contain common dictionary words.');
            }

            $isTrivial = self::isTrivial($newPassword);
            if ($isTrivial) {
                $this->flashSession->error('Password should not contain trivial words.');
            }

            $isPersonal = self::isPersonal($newPassword);
            if ($isPersonal) {
                $this->flashSession->error('Password should not contain personal information. i.e. usernames, names.');
            }

            $hasMatchInSixMonths = self::isNotUsedInSixMonths($newPassword);
            if ($hasMatchInSixMonths) {
                $this->flashSession->error('You cannot use any of your previous passwords for the last 6 months.');
            }            

            if (($changedToday && !$this->session->get('initLogin')) || $inDictionary || $isTrivial || $isPersonal || $hasMatchInSixMonths) {
                $this->session->set('currentPassword', $currentPassword);
                $this->session->set('newPassword', $newPassword);
                $this->session->set('confirmPassword', $confirmPassword);
                $this->response->redirect('session/changepassword');
                return;
            }

            $user = User::findFirstByUserID($userId);

            // Store the password hashed
            //$user->password = $this->security->hash($newPassword);
            $user->password = preg_replace('/2y/', '2a', $this->security->hash($newPassword), 3);

            $query = $this->modelsManager->createQuery("UPDATE User SET userPassword = :pass:, userLastPasswordChange = NOW(), createdBy = :userName:, canEdit = :canEdit: WHERE userID = :userId:");

            $result = $query->execute(
                [
                    'pass'      => $user->password,
                    'userName'  => $user->userName,
                    'userId'    => $userId,
                    'canEdit'   => $user->canEdit
                ]
            );

            // Remove persistent check for initial login.
            $this->session->remove('initLogin');
            $this->session->remove('currentPassword');
            $this->session->remove('newPassword');
            $this->session->remove('confirmPassword');

            $msg = 'Your password was updated successfully!';
            $this->flashSession->success($msg);
            $this->response->redirect('home');

            $this->sessionLogger->info($this->session->get('auth')['name'] . ' changed password.');

        } catch (\Exception $e) {
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    private function isCurrNewPasswordSame($currentPassword, $newPassword)
    {
        return $currentPassword == $newPassword ? true : false;
    }

    private function isPasswordValid($password)
    {
        try {
            $userId = $this->session->get('auth')['id'];

            $user = User::findFirstByUserID($userId);

            $match = $this->security->checkHash($password, $user->userPassword);

            return $match;

        } catch (\Exception $e) {
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    /**
     * Retrieves most recent six passwords of a user.
     */
    private function isLastSixMatch($newPassword)
    {
        $userId = $this->session->get('auth')['id'];
        $hasMatch = false;

        try {
            $hasMatch = false;

            $sql = 'SELECT DISTINCT userPassword, userID 
                    FROM user_prev_password 
                    WHERE userID = ? 
                    AND userprevpasswordChange BETWEEN DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL -6 MONTH) AND CURRENT_TIMESTAMP() 
                    UNION 
                    SELECT DISTINCT userPassword, userid 
                    FROM user 
                    WHERE userID = ?';

            $result = $this->db->query($sql, [$userId, $userId]);        
            $result->setFetchMode(Phalcon\Db::FETCH_OBJ);

            // Match new password hash with the recorded passwords.
            while ($password = $result->fetch()) {
                if($this->security->checkHash($newPassword, $password->userPassword)) {
                    $hasMatch = true;
                    break;
                }
            }

            return $hasMatch;

        } catch (\Exception $e) {
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    /**
     * Retrieves count of passwords made within the day.
     */
    private function isUpdatedToday()
    {
        $userId = $this->session->get('auth')['id'];

        try {
            $count = User::count(
                [
                    "conditions" => "DATEDIFF(now(),userLastPasswordChange) = 0 AND userID = ?1",
                    "bind"       => [
                        1   =>  $userId
                    ]
                ]
            );

            return $count > 0 ? true : false;

        } catch (\Exception $e) {
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    /**
     * Retrieves count of matching words from the dictionary.
     */
    private function isDictMatch($password)
    {        
        try {
            $sql = "SELECT dictionary.*
                    FROM dictionary
                    WHERE isCommon = true AND ((INSTR(BINARY LOWER(?), LOWER(dictionaryWord))) > 0
                    OR INSTR(REVERSE(BINARY LOWER(?)), REVERSE(LOWER(dictionaryWord))) > 0
                    OR INSTR(REVERSE(BINARY LOWER(?)),LOWER(dictionaryWord)) > 0
                    OR INSTR(LOWER(?), REVERSE(LOWER(dictionaryWord))) > 0)";

            $result = $this->db->query($sql, [$password, $password, $password, $password]);

            return $result->numRows() > 0 ? true : false;

        } catch (\Exception $e) {
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    /**
     * Retrieves count any matching trivial words from the dictionary.
     */
    private function isTrivial($password)
    {       
        try {
            $sql = 'SELECT count(dictionaryid) AS Total
                    FROM dictionary
                    WHERE isCommon = false
                    AND ((INSTR(BINARY LOWER(?), LOWER(dictionaryWord))) > 0
                    OR INSTR(REVERSE(BINARY LOWER(?)), REVERSE(LOWER(dictionaryWord)))> 0
                    OR INSTR(REVERSE(BINARY LOWER(?)),LOWER(dictionaryWord))> 0
                    OR INSTR(LOWER(?), REVERSE(LOWER(dictionaryWord)))> 0)';

            $result = $this->db->query($sql, [$password, $password, $password, $password]);
            $result = $result->fetchAll($result);
            $total = intval($result[0]['Total']);
            
            return $total > 0 ? true : false;

        } catch (\Exception $e) {
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    /**
     * Validates if password is same with personal information such as first and last name.
     */
    private function isPersonal($password)
    {      
        $this->view->disable();  
        $userId = intval($this->session->get('auth')['id']);

        try {
            $sql = 'SELECT userID,
                        POSITION(userName IN \'?\') AS m1,
                        POSITION(userLastName IN \'?\') AS m2,
                        POSITION(userFirstName IN \'?\') AS m3
                    FROM user WHERE userID = ' . $userId . ' HAVING m1 > 0 OR m2 > 0 OR m3 > 0';

            $result = $this->db->query($sql, [$password, $password, $password]);
            $r = $result->numRows();
            return $result->numRows() > 0 ? true : false;

        } catch (\Exception $e) {
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }

    /**
     * Validates if password is used within the set month limit e.g. 6 months.
     */
    private function isNotUsedInSixMonths($newPassword)
    {        
        $userId = intval($this->session->get('auth')['id']);

        try {
            $hasMatch = false;

            $sql = 'SELECT DISTINCT userPassword, userid   
                    FROM user_prev_password   
                    WHERE userid = ?  
                        AND userprevpasswordChange BETWEEN DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL -6 MONTH)  
                        AND CURRENT_TIMESTAMP() 
                    UNION  
                    SELECT DISTINCT userPassword, userid   
                        FROM user   
                    WHERE userid = ?';

            $result = $this->db->query($sql, [$userId, $userId]);            
            $result->setFetchMode(Phalcon\Db::FETCH_OBJ);

            // Match new password hash with the recorded passwords.
            while ($password = $result->fetch()) {
                if($this->security->checkHash($newPassword, $password->userPassword)) {
                    $hasMatch = true;
                    break;
                }
            }

            return $hasMatch;

        } catch (\Exception $e) {
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }    

    public function isFiveDaysToExpire()
    {
        $userId = intval($this->session->get('auth')['id']);

        try {
            $sql = "SELECT (userLastPasswordChange >= DATE(NOW() - INTERVAL 25 DAY) + INTERVAL 0 SECOND) AS NotExpired
                    FROM user   
                    WHERE userid = ?";

            $result = $this->db->query($sql, [$userId]);            
            
            return $result->NotExpired ? false : true;

        } catch (\Exception $e) {
            $this->errorLogger->error(parent::_constExceptionMessage($e));
        }
    }
}