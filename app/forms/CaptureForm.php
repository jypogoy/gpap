<?php

use Phalcon\Forms\Form;
use Phalcon\Forms\Element\Text;
use Phalcon\Forms\Element\TextArea;
use Phalcon\Forms\Element\Hidden;
use Phalcon\Forms\Element\Select;
use Phalcon\Forms\Element\Submit;
use Phalcon\Validation\Validator\PresenceOf;
use Phalcon\Validation\Validator\Email;

class CaptureForm extends Form
{

    /**
     * This method returns the default value for field 'csrf'
     */
    public function getCsrf()
    {
        return $this->security->getToken();
    }

    /**
     * Form initializer
     * 
     * @param Entity $entity
     * @param array $options
     */
    public function initialize($entity = null, $options = array())
    {
        // if (!isset($options['edit'])) {
        //     $element = new Text("id");
        //     $this->add($element->setLabel("Id"));
        // } else {
        //     $this->add(new Hidden("id"));
        // }
        
        // Add a text element to capture the 'name'
        $merchId = new Text('mid');
        $merchId->setLabel('Merchant ID');
        $merchId->setAttribute('required', 'true');
        $this->add($merchId);

        $currCode = new Text('ccode');
        $currCode->setLabel('Currency Code');
        $this->add($currCode);

        $depControlNum = new Text('dcnum');
        $depControlNum->setLabel('Deposit Control Number');
        $this->add($depControlNum);

        $depDate = new Text('ddate');
        $depDate->setLabel('Deposit Date');
        $this->add($depDate);    

        $depAmount = new Text('damount');
        $depAmount->setLabel('Total Deposit Admount');
        $this->add($depAmount);

        $cardType = new Select(            
            'cctype',
            [   
                ''          => '-',
                '01'        => '01 - Normal Slip (Manual sales, MOTO, IPP)',
                '02'        => '02 - Airlines Sales',
                '03'        => '03 - VI (Visa Purchasing Sales Slip)',
                '04'        => '04 - Credit slip',
                '05'        => '05 - Airline credit',
                '06'        => '06 - Cash Advance',
                '99'        => '99 - Supporting Document'
            ] 
        );
        $cardType->setLabel('Card Type');
        $cardType->setAttribute('class', 'ui dropdown onmodal');
        $this->add($cardType);

        $pan = new Text('pan');
        $pan->setLabel('Primary Account Number');
        $this->add($pan);

        $transDate = new Text('tdate');
        $transDate->setLabel('Transaction Date');
        $this->add($transDate);

        $authCode = new Text('authcode');
        $authCode->setLabel('Authorization Code');
        $this->add($authCode);

        $transAmount = new Text('transamount');
        $transAmount->setLabel('Transaction Amount');
        $this->add($transAmount);

        $installMonth = new Text('insmonth');
        $installMonth->setLabel('Installment Month');
        $this->add($installMonth);

        // Add a text element to put a hidden CSRF
        $this->add(
            new Hidden(
                'csrf'
            )
        );
    }
}
