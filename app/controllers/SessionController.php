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
        if (!$this->request->isPost()) {
            $this->tag->setDefault('email', 'demo');
            $this->tag->setDefault('password', 'phalcon');
        }

        // Redirect to home if already logged in.
        $auth = $this->session->get('auth');
        if ($auth) {
            return $this->response->redirect('home');
        }

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
            'name' => $user->userFirstName . ' ' . $user->userLastName
        ]);
    }

    /**
     * This action authenticate and logs an user into the application
     *
     */
    public function startAction()
    {
        // $this->view->disable();
        // $x = $this->security->hash('Pogoy');
        if ($this->request->isPost()) {

            $username = $this->request->getPost('username');
            $password = $this->request->getPost('password');
               
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

            $user = User::findFirstByUserName($username);    

            if ($user) {                            
                if ($this->security->checkHash($password, $user->userPassword)) {                    
                    // Check if initial login by comparing lastname and password. Must compare hashes.
                    if ($this->security->checkHash($this->security->hash($password), $user->userLastName)) {
                        $this->flashSession->info('Please change your password.');
                        return $this->response->redirect('session/changepassword');
                    }

                    // Lock user if attempts reaches 3.
                    if ($user->userInvalidLoginAttempt > 3) {
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
                        $this->flash->success('Welcome ' . $user->userName);

                        // Log successful access                    
                        $this->sessionLogger->info($user->userFirstName . ' ' . $user->userLastName . ' logged in @ ' . $this->utils->getRealIpAddr() . '.');

                        $user->userInvalidLoginAttempt = 0;
                        $user->save();

                        return $this->response->redirect('home');
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

    public function changePasswordAction()
    {        
        $this->tag->setTitle('Change Password');
        $this->view->setTemplateAfter('session');
        $this->sessionLogger->info($this->session->get('auth')['name'] . ' @ Change Password page.'); 
    }        

}
