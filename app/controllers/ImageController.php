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
        $filename = "/home/jypogoy/Downloads/gpap_images/BN/20100101-1-001/Airline/scan0002.tif";
        // $image = new Imagick($filename); 
        // $image->setImageFormat('png');
        // $image->thumbnailImage(150, 120);
        // echo '<img id="canvas" src="data:image/png;base64,' . base64_encode($image) . '" />';

        //$data = file_get_contents($filename);

        // $array = array(); 
        // foreach(str_split($data) as $char){ 
        //     array_push($array, ord($char)); 
        // }
        // var_dump(implode(' ', $array));

        $fsize = filesize($filename);

        $handle = fopen($filename, "rb");
        $contents = fread($handle, $fsize);
        fclose($handle);

        // header('content-type: image/png');
        header('Content-Length: ' . $fsize);

        echo $contents;

    }

}
