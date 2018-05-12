<?php

class Dcn extends \Phalcon\Mvc\Model
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
     * @Column(type="integer", length=3, nullable=false)
     */
    public $task_id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=false)
     */
    public $batch_id;

    /**
     *
     * @var string
     * @Column(type="string", length=3, nullable=false)
     */
    public $region_code;

    /**
     *
     * @var string
     * @Column(type="string", length=16, nullable=true)
     */
    public $merchant_number;

    /**
     *
     * @var string
     * @Column(type="string", length=7, nullable=true)
     */
    public $dcn;

    /**
     *
     * @var double
     * @Column(type="double", length=13, nullable=true)
     */
    public $amount;

    /**
     *
     * @var string
     * @Column(type="string", length=100, nullable=true)
     */
    public $image_path;

    /**
     *
     * @var string
     * @Column(type="string", nullable=true)
     */
    public $created_at;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->belongsTo('batch_id', '\Batch', 'id', ['alias' => 'Batch']);
        $this->belongsTo('task_id', '\Task', 'id', ['alias' => 'Task']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'dcn';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Dcn[]|Dcn
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Dcn
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
