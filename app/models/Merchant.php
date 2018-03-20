<?php

class Merchant extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     * @Primary
     * @Identity
     * @Column(type="integer", length=10, nullable=false)
     */
    public $id;

    /**
     *
     * @var string
     * @Column(type="string", length=3, nullable=false)
     */
    public $corporate;

    /**
     *
     * @var string
     * @Column(type="string", length=2, nullable=false)
     */
    public $region;

    /**
     *
     * @var string
     * @Column(type="string", length=3, nullable=false)
     */
    public $principal;

    /**
     *
     * @var string
     * @Column(type="string", length=3, nullable=false)
     */
    public $associate;

    /**
     *
     * @var string
     * @Column(type="string", length=3, nullable=false)
     */
    public $chain;

    /**
     *
     * @var string
     * @Column(type="string", length=16, nullable=false)
     */
    public $merchant;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $status;

    /**
     *
     * @var string
     * @Column(type="string", length=4, nullable=false)
     */
    public $mcc;

    /**
     *
     * @var string
     * @Column(type="string", length=3, nullable=false)
     */
    public $currency;

    /**
     *
     * @var string
     * @Column(type="string", length=32, nullable=false)
     */
    public $dba_name;

    /**
     *
     * @var string
     * @Column(type="string", length=32, nullable=true)
     */
    public $attention;

    /**
     *
     * @var string
     * @Column(type="string", length=32, nullable=true)
     */
    public $address1;

    /**
     *
     * @var string
     * @Column(type="string", length=32, nullable=true)
     */
    public $address2;

    /**
     *
     * @var string
     * @Column(type="string", length=28, nullable=true)
     */
    public $city;

    /**
     *
     * @var string
     * @Column(type="string", length=2, nullable=false)
     */
    public $country_code;

    /**
     *
     * @var string
     * @Column(type="string", length=9, nullable=true)
     */
    public $postal_code;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $language;

    /**
     *
     * @var string
     * @Column(type="string", length=10, nullable=true)
     */
    public $phone_number;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $accept_other_cncy;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $accept_installments;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $accept_retail_sales;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $accept_cash_advance;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $accept_amex;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $accept_cup;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $accept_jcb;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $accept_mastercard;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $accept_privatelabel;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $accept_visa;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("merchant");
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'merchant';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Merchant[]|Merchant|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Merchant|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
