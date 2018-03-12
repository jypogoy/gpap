<?php

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
    protected function initialize()
    {
        $this->tag->prependTitle('GPAP DC | ');
        $this->view->setTemplateAfter('main');
    }

}
