<?php

class ImageController extends ControllerBase
{

    public function initialize()
    {
        
    }

    public function listAction($batchId)
    {                
        $this->view->disable();
        
        $images = Image::find(
            [
                "conditions" => "batch_id = " . $batchId
            ]
        );

        $this->response->setJsonContent($images);
        $this->response->send();        
    }

}
