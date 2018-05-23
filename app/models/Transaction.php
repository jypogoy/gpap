<?php

class Transaction extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     * @Primary
     * @Identity
     * @Column(column="id", type="integer", length=11, nullable=false)
     */
    public $id;

    /**
     *
     * @var integer
     * @Primary
     * @Column(column="merchant_header_id", type="integer", length=11, nullable=false)
     */
    public $merchant_header_id;

    /**
     *
     * @var integer
     * @Column(column="sequence", type="integer", length=3, nullable=false)
     */
    public $sequence;

    /**
     *
     * @var integer
     * @Primary
     * @Column(column="transaction_type_id", type="integer", length=3, nullable=false)
     */
    public $transaction_type_id;

    /**
     *
     * @var string
     * @Column(column="region_code", type="string", length=2, nullable=true)
     */
    public $region_code;

    /**
     *
     * @var string
     * @Column(column="card_number", type="string", length=128, nullable=true)
     */
    public $card_number;

    /**
     *
     * @var string
     * @Column(column="transaction_date", type="string", nullable=true)
     */
    public $transaction_date;

    /**
     *
     * @var string
     * @Column(column="authorization_code", type="string", length=6, nullable=true)
     */
    public $authorization_code;

    /**
     *
     * @var string
     * @Column(column="transaction_amount", type="string", length=12, nullable=true)
     */
    public $transaction_amount;

    /**
     *
     * @var integer
     * @Column(column="installment_months_id", type="integer", length=2, nullable=true)
     */
    public $installment_months_id;

    /**
     *
     * @var integer
     * @Column(column="other_inst_term", type="integer", length=2, nullable=true)
     */
    public $other_inst_term;

    /**
     *
     * @var string
     * @Column(column="airline_ticket_number", type="string", length=13, nullable=true)
     */
    public $airline_ticket_number;

    /**
     *
     * @var string
     * @Column(column="customer_reference_identifier", type="string", length=17, nullable=true)
     */
    public $customer_reference_identifier;

    /**
     *
     * @var string
     * @Column(column="merchant_order_number", type="string", length=25, nullable=true)
     */
    public $merchant_order_number;

    /**
     *
     * @var string
     * @Column(column="commodity_code", type="string", length=4, nullable=true)
     */
    public $commodity_code;

    /**
     *
     * @var integer
     * @Column(column="slip_pull_reason_id", type="integer", length=3, nullable=true)
     */
    public $slip_pull_reason_id;

    /**
     *
     * @var integer
     * @Column(column="exception_id", type="integer", length=2, nullable=true)
     */
    public $exception_id;

    /**
     *
     * @var string
     * @Column(column="other_exception_detail", type="string", length=30, nullable=true)
     */
    public $other_exception_detail;

    /**
     *
     * @var integer
     * @Column(column="image_id", type="integer", length=11, nullable=true)
     */
    public $image_id;

    /**
     *
     * @var string
     * @Column(column="image_file", type="string", length=45, nullable=true)
     */
    public $image_file;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("transaction");
        $this->belongsTo('image_id', '\Image', 'id', ['alias' => 'Image']);
        $this->belongsTo('installment_months_id', '\InstallmentMonths', 'id', ['alias' => 'InstallmentMonths']);
        $this->belongsTo('merchant_header_id', '\MerchantHeader', 'id', ['alias' => 'MerchantHeader']);
        $this->belongsTo('slip_pull_reason_id', '\PullReason', 'id', ['alias' => 'PullReason']);
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
