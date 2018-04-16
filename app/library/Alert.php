<?php

use Phalcon\Mvc\User\Component;

/**
 * Elements
 *
 * Helper class to build display messages.
 */
class Alert extends Component
{  
    public function getSystemMessage($messages)
    {
        if (isset($messages)) {
            $content = '<div class="ui error message">
                            <h4 class="ui header">
                                <i class="warning circle icon"></i>System Response
                            </h4>
                            <p>
                                <ul>';                            
                                    foreach ($messages as $message) {
                                        $content = $content . '<li>' . $message . '</li>';
                                    };                         
            $content = $content . '</ul>
                            </p>
                        </div>';
            echo $content;
        }              
    }

    public function countFlashMessages()
    {
        return count($this->flashSession->getMessages());
    }

    public function listFlashMessages($isOrdered)
    {
        $messages = $this->flashSession->getMessages();        
        if (!is_null($messages)) {
            $messageList = '<' . ($isOrdered ? 'ol' : 'ul') . ' class="list">';
            foreach ($messages as $type => $message) {
                foreach ($message as $text) {
                    $messageList = $messageList . '<li>' . $text . '</li>';
                }
            }
            $messageList = $messageList . '</' . ($isOrdered ? 'ol' : 'ul') . '>';
            echo $messageList;
        }
    }

    public function getRedirectMessage() 
    {
        $messages = $this->flashSession->getMessages();
        if (!is_null($messages)) {
            foreach ($messages as $type => $message) {
                
                switch ($type) {
                case 'success':
                    
                    echo '<script>
                            $(function () {
                                toastr.options = { 
                                    "positionClass" : "toast-top-center toastr-custom-pos" 
                                };
                                toastr.success("' . $message[0] . '");
                            })    
                        </script>';

                    break;
                
                case 'error':
                    
                    echo '<script>
                            $(function () {
                                toastr.options = { 
                                    "positionClass" : "toast-top-center toastr-custom-pos" 
                                };
                                toastr.error("' . $message[0] . '");
                            })    
                        </script>';      

                    break;

                case 'warning':
                    
                    echo '<script>
                            $(function () {
                                toastr.options = { 
                                    "positionClass" : "toast-top-center toastr-custom-pos" 
                                };
                                toastr.warning("' . $message[0] . '");
                            })    
                        </script>'; 
                    
                    break;  

                default: # Notice
                        
                    echo '<script>
                            $(function () {
                                toastr.options = { 
                                    "positionClass" : "toast-top-center toastr-custom-pos" 
                                };
                                toastr.info("' . $message[0] . '");
                            })    
                        </script>';

                    break;
                }
                
                break;
            }  
        }

    }

}