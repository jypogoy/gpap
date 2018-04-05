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

    public function getAction()
    {
        $this->view->disable();

        $file = 'C:\tiff\BN\20100101-1-001\Airline\scan0001-5.tif';
        $content = file_get_contents($file);
        
        $array = array(); 
        foreach(str_split($content) as $char){ 
            array_push($array, ord($char)); 
        }
        var_dump(implode(' ', $array));
    }

}
