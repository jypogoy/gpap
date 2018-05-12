<?php

class DCN extends \Phalcon\Mvc\Model
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
     * @var string
     * @Column(column="region_code", type="string", length=2, nullable=false)
     */
    public $region_code;

    /**
     *
     * @var string
     * @Column(column="merchant_number", type="string", length=16, nullable=false)
     */
    public $merchant_number;

    /**
     *
     * @var string
     * @Column(column="dcn", type="string", length=7, nullable=false)
     */
    public $dcn;

    /**
     *
     * @var double
     * @Column(column="amount", type="double", length=13, nullable=false)
     */
    public $amount;

    /**
     *
     * @var string
     * @Column(column="image_path", type="string", length=100, nullable=true)
     */
    public $image_path;

    /**
     *
     * @var string
     * @Column(column="created_at", type="string", nullable=true)
     */
    public $created_at;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("dcn");
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
     * @return Dcn[]|Dcn|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Dcn|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
