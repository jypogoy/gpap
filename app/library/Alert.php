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

    public function getRedirectMessage() 
    {
        $messages = $this->flashSession->getMessages();
        if (!is_null($messages)) {
            foreach ($messages as $type => $message) {
                
                switch ($type) {
                case 'success':
                    
                    // echo '<div class="ui success floating message">
                    //         <i class="close icon"></i>
                    //         <div class="header">
                    //             <i class="check icon"></i>Success
                    //         </div>
                    //         <p>' . $message[0] . '</p>
                    //     </div>';

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
                    
                    // echo '<div class="ui error floating message">
                    //         <i class="close icon"></i>
                    //         <div class="header">
                    //             <i class="alarm icon"></i>Error
                    //         </div>
                    //         <p>' . $message[0] . '</p>
                    //     </div>';
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
                    
                    // echo '<div class="ui warning floating message">
                    //         <i class="close icon"></i>
                    //         <div class="header">
                    //         <i class="warning sign icon"></i>Warning
                    //         </div>
                    //         <p>' . $message[0] . '</p>
                    //     </div>';
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
                        
                    // echo '<div class="ui info floating message">
                    //         <i class="close icon"></i>
                    //         <div class="header">
                    //         <i class="comment icon"></i>Info
                    //         </div>
                    //         <p>' . $message[0] . '</p>
                    //     </div>'; 
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