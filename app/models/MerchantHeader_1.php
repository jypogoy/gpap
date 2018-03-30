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
    public $batch_id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=16, nullable=false)
     */
    public $merchant_number;

    /**
     *
     * @var string
     * @Column(type="string", length=250, nullable=false)
     */
    public $merchant_name;

    /**
     *
     * @var integer
     * @Column(type="integer", length=3, nullable=false)
     */
    public $currency_id;

    /**
     *
     * @var string
     * @Column(type="string", length=7, nullable=false)
     */
    public $dcn;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    public $deposit_date;

    /**
     *
     * @var integer
     * @Column(type="integer", length=13, nullable=false)
     */
    public $deposit_amount;

    /**
     *
     * @var integer
     * @Column(type="integer", length=3, nullable=true)
     */
    public $pull_reason_id;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("merchant_header");
        $this->hasMany('id', 'Transaction', 'merchant_header_id', ['alias' => 'Transaction']);
        $this->belongsTo('currency_id', '\Currency', 'id', ['alias' => 'Currency']);
        $this->belongsTo('pull_reason_id', '\PullReason', 'id', ['alias' => 'PullReason']);
        $this->belongsTo('batch_id', '\Batch', 'id', ['alias' => 'Batch']);
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
