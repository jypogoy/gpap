<?php

use Phalcon\Logger;
use Phalcon\Logger\Adapter\File as FileAdapter;

class HomeController extends ControllerBase
{

    public function initialize()
    {
        $this->tag->setTitle('Welcome');
        parent::initialize();
    }

    public function indexAction()
    {
        $this->view->user = $this->session->get('auth');       
        var_dump($this->sessionLogger);

        $logger = new FileAdapter(BASE_PATH . '/logs/test.log');

        $logger->critical(
            'This is a critical message'
        );

        $this->sessionLogger->info($this->session->get('auth')['name'] . ' @ Home page.'); 
    }

}