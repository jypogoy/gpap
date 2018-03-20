<?php

class TransactionType extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     * @Primary
     * @Identity
     * @Column(type="integer", length=3, nullable=false)
     */
    public $id;

    /**
     *
     * @var string
     * @Column(type="string", length=45, nullable=false)
     */
    public $name;

    /**
     *
     * @var string
     * @Column(type="string", length=250, nullable=true)
     */
    public $description;

    /**
     *
     * @var string
     * @Column(type="string", length=25, nullable=false)
     */
    public $created_by;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("transaction_type");
        $this->hasMany('id', 'Batch', 'trans_type_id', ['alias' => 'Batch']);
        $this->belongsTo('created_by', '\User1', 'userid', ['alias' => 'User1']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'transaction_type';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return TransactionType[]|TransactionType|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return TransactionType|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
