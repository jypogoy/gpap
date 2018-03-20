<?php

class PullReason extends \Phalcon\Mvc\Model
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
    public $title;

    /**
     *
     * @var string
     * @Column(type="string", length=100, nullable=true)
     */
    public $reason;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    public $level;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("pull_reason");
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'pull_reason';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return PullReason[]|PullReason|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return PullReason|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
