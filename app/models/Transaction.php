<?php

class Transaction extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     * @Primary
     * @Identity
     * @Column(type="integer", length=11, nullable=false)
     */
    public $id;

    /**
     *
     * @var integer
     * @Primary
     * @Column(type="integer", length=11, nullable=false)
     */
    public $merchant_header_id;

    /**
     *
     * @var integer
     * @Primary
     * @Column(type="integer", length=3, nullable=false)
     */
    public $transaction_type_id;

    /**
     *
     * @var string
     * @Column(type="string", length=2, nullable=false)
     */
    public $region_code;

    /**
     *
     * @var string
     * @Column(type="string", length=19, nullable=false)
     */
    public $card_number;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    public $transaction_date;

    /**
     *
     * @var string
     * @Column(type="string", length=6, nullable=false)
     */
    public $authorization_code;

    /**
     *
     * @var integer
     * @Column(type="integer", length=9, nullable=false)
     */
    public $transaction_amount;

    /**
     *
     * @var integer
     * @Column(type="integer", length=2, nullable=true)
     */
    public $installment_months_id;

    /**
     *
     * @var string
     * @Column(type="string", length=13, nullable=true)
     */
    public $airline_ticket_number;

    /**
     *
     * @var string
     * @Column(type="string", length=17, nullable=true)
     */
    public $customer_reference_identifier;

    /**
     *
     * @var string
     * @Column(type="string", length=25, nullable=true)
     */
    public $merchant_order_number;

    /**
     *
     * @var string
     * @Column(type="string", length=4, nullable=true)
     */
    public $commodity_code;

    /**
     *
     * @var integer
     * @Column(type="integer", length=3, nullable=true)
     */
    public $pull_reason_id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=2, nullable=true)
     */
    public $exception_id;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $variance_exception;

    /**
     *
     * @var string
     * @Column(type="string", length=30, nullable=true)
     */
    public $other_exception_detail;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("transaction");
        $this->belongsTo('installment_months_id', '\InstallmentMonths', 'id', ['alias' => 'InstallmentMonths']);
        $this->belongsTo('merchant_header_id', '\MerchantHeader', 'id', ['alias' => 'MerchantHeader']);
        $this->belongsTo('pull_reason_id', '\PullReason', 'id', ['alias' => 'PullReason']);
        $this->belongsTo('transaction_type_id', '\TransactionType', 'id', ['alias' => 'TransactionType']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'transaction';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Transaction[]|Transaction|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Transaction|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
