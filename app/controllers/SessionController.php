<?php

/**
 * SessionController
 *
 * Allows to authenticate users
 */
class SessionController extends ControllerBase
{
    private $logger;
    
    public function initialize()
    {
        $this->tag->setTitle('Sign In');
        parent::initialize();
    }

    public function indexAction()
    {
        // Helper: Generate sample password.
        //$hash = $this->security->hash('test');
        $hash = '';

        // Redirect to home if already logged in.
        $auth = $this->session->get('auth');
        if ($auth) {            
            return $this->response->redirect('home');
        }

        $this->view->hash = $hash;
        $this->view->setTemplateAfter('session');
    }

    /**
     * Register an authenticated user into session data
     *
     * @param User $user
     */
    private function _registerSession(User $user)
    {
        $this->session->set('auth', [
            'id' => $user->userID,
            'name' => $user->userFirstName . ' ' . $user->userLastName,
            'canEdit' => $user->canEdit
        ]);
    }

    /**
     * This action authenticate and logs an user into the application
     *
     */
    public function startAction()
    {      
        if ($this->request->isPost()) {            

            $username = $this->request->getPost('username', 'string');
            $password = $this->request->getPost('password', 'string');
               
            // $user = Users::findFirst([
            //     "(email = :email: OR username = :email:) AND password = :password: AND active = 'Y'",
            //     'bind' => ['email' => $email, 'password' => sha1($password)]
            // ]);

            if (empty($username) || empty($password)) {
                $this->flash->error('Please specify a valid username and password!');
                return $this->dispatcher->forward(
                    [
                        "controller" => "session",
                        "action"     => "index",
                    ]
                );
            }

            //$user = User::findFirstByUserName($username);    
            $user = User::findFirst(
                [
                    "conditions" => "userName = ?1 AND createStatus = 'ACTIVE'",
                    "bind"  => [
                        1   => $username
                    ]
                ]
            );
            
            if ($user) {                        
                $user->canEdit = ($user->canEdit == '0' ? false : true);
                $r = $user->userPassword;    
                if ($this->security->checkHash($password, $user->userPassword)) {                                    
                    // Lock user if attempts reaches 3.
                    if ($user->userInvalidLoginAttempt > 2) {
                        $user->userInvalidLoginAttempt = $user->userInvalidLoginAttempt + 1;
                        $user->save();
                        $this->flash->error('User account is locked!');
                        return $this->dispatcher->forward(
                            [
                                "controller" => "session",
                                "action"     => "index",
                            ]
                        );
                    } else {
                        // The password is valid
                        $this->_registerSession($user);

                        // Check if initial login by comparing password against lastname. Must compare hashes.                        
                        $encLastName = $this->security->hash($user->userLastName);
                        if ($this->security->checkHash($password, $encLastName)) {
                            $this->session->set('initLogin', true);
                            return $this->response->redirect('session/changepassword');
                        }

                        // Check if password expired.
                        $isExpired = self::isPasswordExpired();
                        if ($isExpired) {
                            $this->session->set('initLogin', true);
                            $this->flashSession->error('Your password expired.');
                            return $this->response->redirect('session/changepassword');
                        }

                        // Check if password is expiring.
                        $isExpiring = self::isPasswordExpiring();
                        if ($isExpiring) {
                            $this->flashSession->notice('Your password is expiring soon. Please update as necessary.');
                        }

                        $this->flash->success('Welcome ' . $user->userName);

                        // Log successful access                    
                        $this->sessionLogger->info($user->userFirstName . ' ' . $user->userLastName . ' logged in using IP: ' . $this->utils->getRealIpAddr() . ' with SESSION ID: ' . $this->session->getId() . '.');                        

                        try {
                            $user->userInvalidLoginAttempt = 0;
                            $user->save();
                            return $this->response->redirect('home');

                        } catch (\Exception $e) {
                            $this->session->remove('auth');
                            $this->flash->error('An error occurred while registering your system access.');

                            // Destroy the whole session
                            $this->session->destroy();

                            $this->errorLogger->error(parent::_constExceptionMessage($e));                                                        

                            $this->view->setTemplateAfter('error');
                            return $this->dispatcher->forward(
                                [
                                    "errors" => 'show500',
                                ]
                            );
                        }                            
                    }
                } else {
                    $user->userInvalidLoginAttempt = $user->userInvalidLoginAttempt + 1;
                    $user->save();
                    $this->flash->error('Wrong username or password!');
                }
            } else {
                // To protect against timing attacks. Regardless of whether a user exists or not, the script will take roughly the same amount as it will always be computing a hash.
                $this->security->hash(rand());
                $this->flash->error('Wrong username or password!');
            }

        }

        return $this->dispatcher->forward(
            [
                "controller" => "session",
                "action"     => "index",
            ]
        );
    }

    /**
     * Finishes the active session redirecting to the index
     *
     * @return unknown
     */
    public function endAction()
    {
        $this->session->remove('auth');
        $this->flash->success('You have successfully signed out. Goodbye!');
        
        // Destroy the whole session
        $this->session->destroy();

        return $this->dispatcher->forward(
            [
                "controller" => "index",
                "action"     => "index",
            ]
        );
    }

    public function expiredAction()
    {
        $this->session->remove('auth');
        
        // Destroy the whole session
        $this->session->destroy();

        return $this->dispatcher->forward(
            [
                "controller" => "index",
                "action"     => "index",
            ]
        );
    }

    public function changePasswordAction()
    {        
        $this->tag->setTitle('Change Password');
        $this->view->setTemplateAfter('session');

        $currentPassword = $this->session->get('currentPassword');
        $newPassword = $this->session->get('newPassword');
        $confirmPassword = $this->session->get('confirmPassword');

        $this->view->currentPassword = $currentPassword;
        $this->view->newPassword = $newPassword;
        $this->view->confirmPassword = $confirmPassword;

        $this->sessionLogger->info($this->session->get('auth')['name'] . ' @ Change Password page.'); 
    }        

    private function isPasswordExpired() 
    {
        $userId = intval($this->session->get('auth')['id']);

        try {
            $sql = "SELECT (userLastPasswordChange > DATE(NOW() - INTERVAL 29 DAY) + INTERVAL 0 SECOND) AS NotExpired
                    FROM user   
                    WHERE userid = " . $userId;

            $result = $this->db->fetchOne($sql);            
            
            return $result['NotExpired'] ? false : true;

        } catch (\Exception $e) {
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }

    private function isPasswordExpiring() 
    {
        $userId = intval($this->session->get('auth')['id']);

        try {
            $sql = "SELECT (userLastPasswordChange >= DATE(NOW() - INTERVAL 24 DAY)) AS NotExpired
                    FROM user   
                    WHERE userid = " . $userId;

            $result = $this->db->fetchOne($sql);            
            
            return $result['NotExpired'] ? false : true;

        } catch (\Exception $e) {
            $this->errorLogger->error(parent::_consterrorMessage($e));
        }
    }

    public function keepAliveAction()
    {
        $this->view->disable();        
        
        parent::checkSession();        
                
        $auth = $this->session->get('auth');
        // $this->session->set('auth', $auth);
        // $this->session->set('LAST_ACTIVITY', time());

        return $auth['name'];

        // session_regenerate_id(true);
        // echo $this->session->getId();
    }
}
