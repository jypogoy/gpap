<?php

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
    protected function initialize()
    {
        $f = $this->dispatcher->getActionName();
        if ($this->session->get('initLogin') 
            && $this->dispatcher->getActionName() != 'changepassword' 
            && $this->dispatcher->getActionName() != 'end'
            && $this->dispatcher->getControllerName() != 'about' ) {
            return $this->response->redirect('session/changepassword');            
        }   

        $this->tag->prependTitle('GPAP DE | ');
        $this->view->setTemplateAfter('main');        

        $this->view->policy_url = $this->config->get('policy_url');
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
