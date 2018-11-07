<?php

class Demographic extends \Phalcon\Mvc\Model
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
     * @Column(type="string", length=3, nullable=true)
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
     * @Column(type="string", length=3, nullable=true)
     */
    public $principal;

    /**
     *
     * @var string
     * @Column(type="string", length=3, nullable=true)
     */
    public $associate;

    /**
     *
     * @var string
     * @Column(type="string", length=3, nullable=true)
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
    public $merchantStatus;

    /**
     *
     * @var string
     * @Column(type="string", length=4, nullable=true)
     */
    public $merchantCategoryCode;

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
    public $doingBusinessAs;

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
    public $firstAddress;

    /**
     *
     * @var string
     * @Column(type="string", length=32, nullable=true)
     */
    public $secondAddress;

    /**
     *
     * @var string
     * @Column(type="string", length=28, nullable=true)
     */
    public $city;

    /**
     *
     * @var string
     * @Column(type="string", length=2, nullable=true)
     */
    public $stateCountry;

    /**
     *
     * @var string
     * @Column(type="string", length=9, nullable=true)
     */
    public $postal;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $spokenLanguage;

    /**
     *
     * @var string
     * @Column(type="string", length=10, nullable=true)
     */
    public $telephoneNumber;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptOtherCurrency;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptInstallment;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptRetailSales;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptCashAdvance;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptAmex;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptCup;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptJcb;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptMasterCard;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptPrivateLabel;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptVisa;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptDiners;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=false)
     */
    public $acceptDiscover;

    /**
     *
     * @var string
     * @Column(type="string", length=45, nullable=false)
     */
    public $createdBy;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    public $createdDate;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("demographic");
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'demographic';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Demographic[]|Demographic|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Demographic|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
