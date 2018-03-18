<?php

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
    protected function initialize()
    {
        $this->tag->prependTitle('GPAP DE | ');
        $this->view->setTemplateAfter('main');
    }

}
