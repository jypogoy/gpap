<?php

class ImageController extends ControllerBase
{

    public function initialize()
    {
        
    }

    public function listAction($batchId)
    {                
        $this->view->disable();
        
        try {
            $images = Image::find(
                [
                    "conditions" => "batch_id = " . $batchId
                ]
            );

            $this->response->setJsonContent($images);
            $this->response->send();        

        } catch (\Exception $e) {            
            $this->exceptionLogger->error(parent::_constExceptionMessage($e));
        }
    }

    public function getAction()
    {
        $this->view->disable();
        $filename = "C:\\tiff\\BN\\20100101-1-001\\Airline\\scan0001-5.tif";
        $image = new Imagick($filename); 
        $image->setImageFormat('png');
        //$image->thumbnailImage(150, 120);
        echo '<img id="canvas" src="data:image/png;base64,' . base64_encode($image) . '" />';
    }

}
