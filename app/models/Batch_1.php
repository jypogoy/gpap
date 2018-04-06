<?php

class Batch extends \Phalcon\Mvc\Model
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
    public $zip_id;

    /**
     *
     * @var integer
     * @Primary
     * @Column(type="integer", length=3, nullable=false)
     */
    public $trans_type_id;

    /**
     *
     * @var string
     * @Column(type="string", nullable=true)
     */
    public $entry_status;

    /**
     *
     * @var string
     * @Column(type="string", nullable=true)
     */
    public $verify_status;

    /**
     *
     * @var string
     * @Column(type="string", length=25, nullable=true)
     */
    public $created_by;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("batch");
        $this->hasMany('id', 'Image', 'batch_id', ['alias' => 'Image']);
        $this->hasMany('id', 'MerchantHeader', 'batch_id', ['alias' => 'MerchantHeader']);
        $this->belongsTo('zip_id', '\Zip', 'id', ['alias' => 'Zip']);
        $this->belongsTo('trans_type_id', '\TransactionType', 'id', ['alias' => 'TransactionType']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'batch';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Batch[]|Batch|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Batch|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
