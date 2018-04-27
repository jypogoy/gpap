<?php

use Phalcon\Mvc\User\Component;

/**
 * Elements
 *
 * Helps to build UI elements for the application
 */
class Elements extends Component
{
    private $_headerMenu = [
        'left' => [
            'home' => [
                'caption'   => 'Home',
                'action'    => 'home',
                'iconClass' => 'home icon'
            ],
            'edits' => [
                'caption'   => 'Batch Edit',
                'action'    => 'index',
                'iconClass' => 'pencil icon'
            ],
            'about' => [
                'caption'   => 'About',
                'action'    => 'index',
                'iconClass' => 'info circle icon'
            ],
            // 'contact' => [
            //     'caption'   => 'Contact',
            //     'action'    => 'index',
            //     'iconClass' => 'volume control phone icon'
            // ]
        ],
        'right' => [
            'session'       => [
                'caption'   => 'Log In',
                'action'    => 'index',
                'iconClass' => 'plug icon'
            ]
        ]
    ];

    private $_tabs = [
        
    ];

    /**
     * Builds header menu with left and right items
     *
     * @return string
     */
    public function getMenu()
    {

        $auth = $this->session->get('auth');
        if ($auth) {
            $this->_headerMenu['right']['session'] = [
                'caption' => 'Log Out',
                'action' => 'end',
                'iconClass' => 'power off icon'
            ];
        } else {
            unset($this->_headerMenu['left']['home']);
            unset($this->_headerMenu['left']['edits']);
        }

        // For initial login: Remove menu items.
        if ($this->session->get('initLogin')) { 
            unset($this->_headerMenu['left']['home']);
            unset($this->_headerMenu['left']['edits']);
        }

        $controllerName = $this->view->getControllerName();
        $actionName = $this->view->getActionName();
        foreach ($this->_headerMenu as $position => $menu) {
            if ($position == 'right') {                
                echo '<div class="right menu">';   
                $auth = $this->session->get('auth');
                if ($auth) {            
                    echo '<div class="ui pointing dropdown link item user-profile-dropdown">' . 
                            '<img class="ui avatar image" src="/gpap/public/img/avatar/avatar.png"><span style="padding-left: 10px;">' . $auth['name'] . '</span>' . 
                            '<i class="dropdown icon"></i>' .
                            '<div class="menu">' .
                                '<a href="/gpap/session/changepassword"><div class="' . ($actionName == 'changepassword' ? 'disabled' : '') . ' item"><i class="key icon"></i>Change Password</div></a>' .
                            '</div>' .
                        '</div>';                    
                }
            }                
            foreach ($menu as $controller => $option) {
                if ($controllerName == $controller) {
                    echo $this->tag->linkTo([$controller != 'index' ? $controller . ($controller == 'session' ? '/' . $option['action'] : '') : '', (isset($option['iconClass']) ? '<i class="' . $option['iconClass'] . '"></i>' : '') . $option['caption'], 'class' => 'active item']);
                } else {
                    echo $this->tag->linkTo([$controller != 'index' ? $controller . ($controller == 'session' ? '/' . $option['action'] : '') : '', (isset($option['iconClass']) ? '<i class="' . $option['iconClass'] . '"></i>' : '') . $option['caption'], 'class' => 'item']);
                }
            }
            if ($position == 'right') {
                echo '</div>';
            }    
        }
    }

    /**
     * Returns menu tabs
     */
    public function getTabs()
    {
        $controllerName = $this->view->getControllerName();
        $actionName = $this->view->getActionName();
        echo '<ul class="nav nav-tabs">';
        foreach ($this->_tabs as $caption => $option) {
            if ($option['controller'] == $controllerName && ($option['action'] == $actionName || $option['any'])) {
                echo '<li class="active">';
            } else {
                echo '<li>';
            }
            echo $this->tag->linkTo($option['controller'] . '/' . $option['action'], $caption), '</li>';
        }
        echo '</ul>';
    }
    
}
