<?php

use Phalcon\Mvc\Controller;

class ControllerBase extends Controller
{
    protected function initialize()
    {
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

    protected function checkSession()
    {
        if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $this->config->get('session_lifetime'))) {            
            // Last request was more than [session_lifetime] minutes ago
            session_unset();     // unset $_SESSION variable for the run-time 
            session_destroy();   // destroy session data in storage     
            $this->dispatcher->forward([
				'controller' => 'errors',
				'action'     => 'show401'
			]);       
        }

        $_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp     
    }
}
