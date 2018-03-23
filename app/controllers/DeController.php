<?php

class DeController extends ControllerBase
{

    public function initialize()
    {
        $this->tag->setTitle('Data Entry');
        parent::initialize();
    }

    public function indexAction($batchId=null)
    {
        if (!$this->request->isPost()) {
            
            $batch = Batch::findFirstById($batchId); 

            $this->view->batch = $batch;
            $this->view->setTemplateAfter('de');
        } else {
            return $this->response->redirect('');
        }
    }

    public function startAction($batchId)
    {
        if (!$this->request->isPost()) {
            
            $batch = Batch::findById($batchId); 

            $this->view->batch = $batch;
            $this->view->setTemplateAfter('de');
        } else {
            return $this->response->redirect('');
        }
    }

}
