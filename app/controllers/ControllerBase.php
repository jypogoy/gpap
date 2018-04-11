<?php

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
    protected function initialize()
    {
        $this->tag->prependTitle('GPAP DE | ');
        $this->view->setTemplateAfter('main');        
    }

    public function _constExceptionMessage(\Exception $e)
    {
        $msg = get_class($e) . ': ' . $e->getMessage() . "\n" . 
                'File=' . $e->getFile() . "\n" . 
                'Line=' . $e->getLine() . "\n" . 
                $e->getTraceAsString() . "\n";
        return $msg;
    }
}
