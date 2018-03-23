<?php
 
use Phalcon\Mvc\Model\Criteria;
use Phalcon\Paginator\Adapter\Model as Paginator;


class UserController extends ControllerBase
{
    /**
     * Index action
     */
    public function indexAction()
    {
        $this->persistent->parameters = null;
    }

    /**
     * Searches for user
     */
    public function searchAction()
    {
        $numberPage = 1;
        if ($this->request->isPost()) {
            $query = Criteria::fromInput($this->di, 'User', $_POST);
            $this->persistent->parameters = $query->getParams();
        } else {
            $numberPage = $this->request->getQuery("page", "int");
        }

        $parameters = $this->persistent->parameters;
        if (!is_array($parameters)) {
            $parameters = [];
        }
        $parameters["order"] = "userID";

        $user = User::find($parameters);
        if (count($user) == 0) {
            $this->flash->notice("The search did not find any user");

            $this->dispatcher->forward([
                "controller" => "user",
                "action" => "index"
            ]);

            return;
        }

        $paginator = new Paginator([
            'data' => $user,
            'limit'=> 10,
            'page' => $numberPage
        ]);

        $this->view->page = $paginator->getPaginate();
    }

    /**
     * Displays the creation form
     */
    public function newAction()
    {

    }

    /**
     * Edits a user
     *
     * @param string $userID
     */
    public function editAction($userID)
    {
        if (!$this->request->isPost()) {

            $user = User::findFirstByuserID($userID);
            if (!$user) {
                $this->flash->error("user was not found");

                $this->dispatcher->forward([
                    'controller' => "user",
                    'action' => 'index'
                ]);

                return;
            }

            $this->view->userID = $user->userID;

            $this->tag->setDefault("userID", $user->userID);
            $this->tag->setDefault("userName", $user->userName);
            $this->tag->setDefault("userLastName", $user->userLastName);
            $this->tag->setDefault("userFirstName", $user->userFirstName);
            $this->tag->setDefault("userMiddleName", $user->userMiddleName);
            $this->tag->setDefault("userPassword", $user->userPassword);
            $this->tag->setDefault("userLastLogin", $user->userLastLogin);
            $this->tag->setDefault("userInvalidLoginAttempt", $user->userInvalidLoginAttempt);
            $this->tag->setDefault("userLastPasswordChange", $user->userLastPasswordChange);
            $this->tag->setDefault("userEmail", $user->userEmail);
            $this->tag->setDefault("userTeam", $user->userTeam);
            $this->tag->setDefault("createStatus", $user->createStatus);
            $this->tag->setDefault("createdBy", $user->createdBy);
            
        }
    }

    /**
     * Creates a new user
     */
    public function createAction()
    {
        if (!$this->request->isPost()) {
            $this->dispatcher->forward([
                'controller' => "user",
                'action' => 'index'
            ]);

            return;
        }

        $user = new User();
        $user->userName = $this->request->getPost("userName");
        $user->userLastName = $this->request->getPost("userLastName");
        $user->userFirstName = $this->request->getPost("userFirstName");
        $user->userMiddleName = $this->request->getPost("userMiddleName");
        $user->userPassword = $this->request->getPost("userPassword");
        $user->userLastLogin = $this->request->getPost("userLastLogin");
        $user->userInvalidLoginAttempt = $this->request->getPost("userInvalidLoginAttempt");
        $user->userLastPasswordChange = $this->request->getPost("userLastPasswordChange");
        $user->userEmail = $this->request->getPost("userEmail");
        $user->userTeam = $this->request->getPost("userTeam");
        $user->createStatus = $this->request->getPost("createStatus");
        $user->createdBy = $this->request->getPost("createdBy");
        

        if (!$user->save()) {
            foreach ($user->getMessages() as $message) {
                $this->flash->error($message);
            }

            $this->dispatcher->forward([
                'controller' => "user",
                'action' => 'new'
            ]);

            return;
        }

        $this->flash->success("user was created successfully");

        $this->dispatcher->forward([
            'controller' => "user",
            'action' => 'index'
        ]);
    }

    /**
     * Saves a user edited
     *
     */
    public function saveAction()
    {

        if (!$this->request->isPost()) {
            $this->dispatcher->forward([
                'controller' => "user",
                'action' => 'index'
            ]);

            return;
        }

        $userID = $this->request->getPost("userID");
        $user = User::findFirstByuserID($userID);

        if (!$user) {
            $this->flash->error("user does not exist " . $userID);

            $this->dispatcher->forward([
                'controller' => "user",
                'action' => 'index'
            ]);

            return;
        }

        $user->userName = $this->request->getPost("userName");
        $user->userLastName = $this->request->getPost("userLastName");
        $user->userFirstName = $this->request->getPost("userFirstName");
        $user->userMiddleName = $this->request->getPost("userMiddleName");
        $user->userPassword = $this->request->getPost("userPassword");
        $user->userLastLogin = $this->request->getPost("userLastLogin");
        $user->userInvalidLoginAttempt = $this->request->getPost("userInvalidLoginAttempt");
        $user->userLastPasswordChange = $this->request->getPost("userLastPasswordChange");
        $user->userEmail = $this->request->getPost("userEmail");
        $user->userTeam = $this->request->getPost("userTeam");
        $user->createStatus = $this->request->getPost("createStatus");
        $user->createdBy = $this->request->getPost("createdBy");
        

        if (!$user->save()) {

            foreach ($user->getMessages() as $message) {
                $this->flash->error($message);
            }

            $this->dispatcher->forward([
                'controller' => "user",
                'action' => 'edit',
                'params' => [$user->userID]
            ]);

            return;
        }

        $this->flash->success("user was updated successfully");

        $this->dispatcher->forward([
            'controller' => "user",
            'action' => 'index'
        ]);
    }

    /**
     * Deletes a user
     *
     * @param string $userID
     */
    public function deleteAction($userID)
    {
        $user = User::findFirstByuserID($userID);
        if (!$user) {
            $this->flash->error("user was not found");

            $this->dispatcher->forward([
                'controller' => "user",
                'action' => 'index'
            ]);

            return;
        }

        if (!$user->delete()) {

            foreach ($user->getMessages() as $message) {
                $this->flash->error($message);
            }

            $this->dispatcher->forward([
                'controller' => "user",
                'action' => 'search'
            ]);

            return;
        }

        $this->flash->success("user was deleted successfully");

        $this->dispatcher->forward([
            'controller' => "user",
            'action' => "index"
        ]);
    }

}
