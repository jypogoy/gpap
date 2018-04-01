<?php

class IndexController extends ControllerBase
{

    public function initialize()
    {
        $this->tag->setTitle('Welcome');
        parent::initialize();
    }

    public function indexAction()
    {
        $auth = $this->session->get('auth');
        
        if ($auth) {
            $this->dispatcher->forward([
                'controller' => "home",
                'action' => 'index'
            ]);
        } else {
            $this->dispatcher->forward([
                'controller' => "session",
                'action' => 'index'
            ]);
        }

        return;
    }

}

