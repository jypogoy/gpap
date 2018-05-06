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
                            <i class="' . ($action == 'delete' ? 'trash outline red' : 'check green') . ' icon"></i> ' . ucwords($action) . ' ' . ucwords($entityName) . '
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

    public function getWarning()
    {
        $content = '<div class="ui tiny modal warning">
                        <i class="close icon"></i>
                        <div class="header">
                            <i class="warning orange icon"></i>Warning
                        </div>
                        <div class="content warning-text" style="min-height: 30px;">        
                        </div>
                        <div class="actions">
                            <div class="ui negative button">Cancel</div>
                            <div class="ui positive button">Proceed Anyway</div>
                        </div>
                    </div>';

        echo $content;
    }

}    