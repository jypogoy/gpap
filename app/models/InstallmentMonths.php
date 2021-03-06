<?php

class InstallmentMonths extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     * @Primary
     * @Identity
     * @Column(column="id", type="integer", length=2, nullable=false)
     */
    public $id;

    /**
     *
     * @var string
     * @Column(column="on_display", type="string", length=45, nullable=false)
     */
    public $on_display;

    /**
     *
     * @var string
     * @Column(column="on_report", type="string", length=45, nullable=false)
     */
    public $on_report;

    /**
     *
     * @var string
     * @Column(column="charge_type", type="string", length=45, nullable=false)
     */
    public $charge_type;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("installment_months");
        $this->hasMany('id', 'Transaction', 'installment_months_id', ['alias' => 'Transaction']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'installment_months';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return InstallmentMonths[]|InstallmentMonths|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return InstallmentMonths|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
