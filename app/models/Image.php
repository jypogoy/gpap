<?php

class Image extends \Phalcon\Mvc\Model
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
     * @Column(type="string", length=250, nullable=false)
     */
    public $path;

    /**
     *
     * @var string
     * @Column(type="string", length=45, nullable=true)
     */
    public $type;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=false)
     */
    public $zip_id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=3, nullable=false)
     */
    public $trans_type_id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=true)
     */
    public $batch_id;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $is_start;

    /**
     *
     * @var string
     * @Column(type="string", length=1, nullable=true)
     */
    public $is_completed;

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
        $this->setSource("image");
        $this->belongsTo('batch_id', '\Batch', 'id', ['alias' => 'Batch']);
        $this->belongsTo('zip_id', '\Zip', 'id', ['alias' => 'Zip']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'image';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Image[]|Image|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Image|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
