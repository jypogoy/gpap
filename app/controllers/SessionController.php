<?php

/**
 * SessionController
 *
 * Allows to authenticate users
 */
class SessionController extends ControllerBase
{
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
        if ($this->request->isPost()) {

            $username = $this->request->getPost('username');
            $password = $this->request->getPost('password');

            // $user = Users::findFirst([
            //     "(email = :email: OR username = :email:) AND password = :password: AND active = 'Y'",
            //     'bind' => ['email' => $email, 'password' => sha1($password)]
            // ]);

            $user = User::findFirstByUserName($username);    

            if ($user) {
                if ($this->security->checkHash($password, $user->userPassword)) {
                    // The password is valid
                    $this->_registerSession($user);
                    $this->flash->success('Welcome ' . $user->userName);

                    return $this->response->redirect('home');
                }
            } else {
                // To protect against timing attacks. Regardless of whether a user exists or not, the script will take roughly the same amount as it will always be computing a hash.
                $this->security->hash(rand());
            }

            // $user = new User();
            // $user->id = '2';
            // $user->name = 'Jeffrey Pogoy';

            // if ($user != false) {
                // $this->_registerSession($user);
                // $this->flash->success('Welcome ' . $user->name);

                // return $this->response->redirect('home');
            // }

            // The validation has failed
            $this->flash->error('Wrong username or password');
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
}
