<?php

class DataEntry extends \Phalcon\Mvc\Model
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
     * @Column(type="integer", length=1, nullable=false)
     */
    public $user_id;

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
     * @Primary
     * @Column(type="integer", length=3, nullable=false)
     */
    public $task_id;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    public $started_at;

    /**
     *
     * @var string
     * @Column(type="string", nullable=true)
     */
    public $ended_at;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("data_entry");
        $this->hasOne('id', 'MerchantHeader', 'data_entry_id', ['alias' => 'MerchantHeader']);
        $this->belongsTo('task_id', '\Task', 'id', ['alias' => 'Task']);
        $this->belongsTo('batch_id', '\Batch', 'id', ['alias' => 'Batch']);
        $this->belongsTo('user_id', '\User', 'userID', ['alias' => 'User']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'data_entry';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return DataEntry[]|DataEntry|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return DataEntry|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
