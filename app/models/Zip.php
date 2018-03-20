<?php

class Zip extends \Phalcon\Mvc\Model
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
     * @var string
     * @Column(type="string", length=2, nullable=false)
     */
    public $region_code;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    public $rec_date;

    /**
     *
     * @var integer
     * @Column(type="integer", length=4, nullable=false)
     */
    public $operator_id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=4, nullable=false)
     */
    public $sequence;

    /**
     *
     * @var string
     * @Column(type="string", length=32, nullable=false)
     */
    public $created_by;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("zip");
        $this->hasMany('id', 'Batch', 'zip_id', ['alias' => 'Batch']);
        $this->hasMany('id', 'Image', 'zip_id', ['alias' => 'Image']);
        $this->belongsTo('region_code', '\Region', 'code', ['alias' => 'Region']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'zip';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Zip[]|Zip|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Zip|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
