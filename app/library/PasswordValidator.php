<?php

use Phalcon\Validation;
use Phalcon\Validation\Validator\Password;
use Phalcon\Validation\Validator\PresenceOf;

class PasswordValidator extends Validation
{

    public function initialize()
    {
        $this->add(
            'current_password',
            new PresenceOf(
                [
                    'message' => 'Your current password is required.'
                ]
            )
        );  

        $this->add(
            'new_password',
            new PresenceOf(
                [
                    'message' => 'Your new password is required.'
                ]
            )
        );  
        
        $this->add(
            'confirm_password',
            new PresenceOf(
                [
                    'message' => 'Confirm your new password.'
                ]
            )
        );  
    }

}