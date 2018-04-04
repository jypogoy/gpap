<?php

class MerchantHeader extends \Phalcon\Mvc\Model
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
    public $data_entry_id;

    /**
     *
     * @var integer
     * @Primary
     * @Column(type="integer", length=11, nullable=false)
     */
    public $batch_id;

    /**
     *
     * @var string
     * @Column(type="string", length=16, nullable=true)
     */
    public $merchant_number;

    /**
     *
     * @var string
     * @Column(type="string", length=250, nullable=true)
     */
    public $merchant_name;

    /**
     *
     * @var integer
     * @Column(type="integer", length=3, nullable=true)
     */
    public $currency_id;

    /**
     *
     * @var string
     * @Column(type="string", length=3, nullable=true)
     */
    public $other_currency;

    /**
     *
     * @var string
     * @Column(type="string", length=7, nullable=true)
     */
    public $dcn;

    /**
     *
     * @var string
     * @Column(type="string", nullable=true)
     */
    public $deposit_date;

    /**
     *
     * @var double
     * @Column(type="double", length=13, nullable=true)
     */
    public $deposit_amount;

    /**
     *
     * @var integer
     * @Column(type="integer", length=3, nullable=true)
     */
    public $batch_pull_reason_id;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("merchant_header");
        $this->hasMany('id', 'Transaction', 'merchant_header_id', ['alias' => 'Transaction']);
        $this->belongsTo('currency_id', '\Currency', 'id', ['alias' => 'Currency']);
        $this->belongsTo('batch_pull_reason_id', '\PullReason', 'id', ['alias' => 'PullReason']);
        $this->belongsTo('batch_id', '\Batch', 'id', ['alias' => 'Batch']);
        $this->belongsTo('data_entry_id', '\DataEntry', 'id', ['alias' => 'DataEntry']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'merchant_header';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return MerchantHeader[]|MerchantHeader|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return MerchantHeader|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
