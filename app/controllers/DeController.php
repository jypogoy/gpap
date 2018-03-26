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
        $batch = Batch::findFirstById($batchId); 

        $this->view->batch = $batch;
        $this->view->setTemplateAfter('de');
    }

    public function startAction($batchId)
    {        
        $batch = Batch::findById($batchId); 

        $this->view->batch = $batch;
        $this->view->setTemplateAfter('de');
    }

}
