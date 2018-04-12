<?php

use Phalcon\Mvc\Model\Resultset\Simple as Resultset;

class UserPrevPassword extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     * @Primary
     * @Identity
     * @Column(type="integer", length=10, nullable=false)
     */
    public $userprevpasswordID;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=false)
     */
    public $userID;

    /**
     *
     * @var string
     * @Column(type="string", length=60, nullable=false)
     */
    public $userPassword;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    public $userprevpasswordChange;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("user_prev_password");
        $this->belongsTo('userID', '\User', 'userID', ['alias' => 'User']);
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'user_prev_password';
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return UserPrevPassword[]|UserPrevPassword|\Phalcon\Mvc\Model\ResultSetInterface
     */
    public static function find($parameters = null)
    {
        return parent::find($parameters);
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return UserPrevPassword|\Phalcon\Mvc\Model\ResultInterface
     */
    public static function findFirst($parameters = null)
    {
        return parent::findFirst($parameters);
    }

    public static function findLastSix($conditions, $params = null)
    {
        $sql = "SELECT DISTINCT userPassword, userID " .
                "FROM user_prev_password ";
                "WHERE $conditions " .
                "AND userprevpasswordChange BETWEEN DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL -6 MONTH) AND CURRENT_TIMESTAMP() " .
                "UNION " .
                "SELECT DISTINCT userPassword, userid " .
                "FROM user " .
                "WHERE userid = :userId2: ";

        $prevPassword = new UserPrevPassword();

        $x = new ResultSet(null, $prevPassword, $prevPassword->getReadConnection()->query($sql, $params));

        return ''; 
    }
}
