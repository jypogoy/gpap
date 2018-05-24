<?php

class User extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     * @Primary
     * @Identity
     * @Column(column="userID", type="integer", length=1, nullable=false)
     */
    public $userID;

    /**
     *
     * @var string
     * @Column(column="userName", type="string", length=32, nullable=false)
     */
    public $userName;

    /**
     *
     * @var string
     * @Column(column="userFirstName", type="string", length=64, nullable=false)
     */
    public $userFirstName;

    /**
     *
     * @var string
     * @Column(column="userLastName", type="string", length=64, nullable=false)
     */
    public $userLastName;

    /**
     *
     * @var string
     * @Column(column="userPassword", type="string", length=60, nullable=false)
     */
    public $userPassword;

    /**
     *
     * @var string
     * @Column(column="userLastLogin", type="string", nullable=true)
     */
    public $userLastLogin;

    /**
     *
     * @var integer
     * @Column(column="userInvalidLoginAttempt", type="integer", length=11, nullable=false)
     */
    public $userInvalidLoginAttempt;

    /**
     *
     * @var string
     * @Column(column="userLastPasswordChange", type="string", nullable=false)
     */
    public $userLastPasswordChange;

    /**
     *
     * @var string
     * @Column(column="canEdit", type="string", length=1, nullable=true)
     */
    public $canEdit;

    /**
     *
     * @var string
     * @Column(column="createStatus", type="string", nullable=false)
     */
    public $createStatus;

    /**
     *
     * @var string
     * @Column(column="createdBy", type="string", length=32, nullable=false)
     */
    public $createdBy;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("user");
        $this->hasMany('userID', 'DataEntry', 'user_id', ['alias' => 'DataEntry']);
        $this->hasMany('userID', 'UserPrevPassword', 'userID', ['alias' => 'UserPrevPassword']);
        $this->hasMany('userID', 'UserRole', 'userID', ['alias' => 'UserRole']);
        $this->hasMany('userID', 'UserTask', 'user_id', ['alias' => 'UserTask']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'user';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return User[]|User|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return User|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

}
