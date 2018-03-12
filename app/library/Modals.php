<?php

use Phalcon\Mvc\User\Component;

/**
 * Elements
 *
 * Helper class to build modal confirmation messages.
 * See page javascript for further implementation.
 */
class Modals extends Component
{  

    public function getConfirmation($action, $entityName)
    {

        //$controllerName = $this->view->getControllerName();

        $content = '<div class="ui tiny modal '. $action . ' ' . $entityName . '">
                        <i class="close icon"></i>
                        <div class="header">
                            <i class="trash outline icon"></i> ' . ucwords($action) . ' ' . ucwords($entityName) . '
                        </div>
                        <div class="content custom-text" style="min-height: 30px;">        
                        </div>
                        <div class="actions">
                            <div class="ui negative button">Cancel</div>
                            <div class="ui positive button">OK</div>
                        </div>
                    </div>';

        echo $content;
    }

}    