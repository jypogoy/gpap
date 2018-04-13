<?php

use Phalcon\Mvc\Model\Resultset\Simple as Resultset;

class User extends \Phalcon\Mvc\Model
{

    protected $db;

    /**
     *
     * @var integer
     * @Primary
     * @Identity
     * @Column(type="integer", length=1, nullable=false)
     */
    public $userID;

    /**
     *
     * @var string
     * @Column(type="string", length=32, nullable=false)
     */
    public $userName;

    /**
     *
     * @var string
     * @Column(type="string", length=64, nullable=false)
     */
    public $userLastName;

    /**
     *
     * @var string
     * @Column(type="string", length=64, nullable=false)
     */
    public $userFirstName;

    /**
     *
     * @var string
     * @Column(type="string", length=64, nullable=true)
     */
    public $userMiddleName;

    /**
     *
     * @var string
     * @Column(type="string", length=60, nullable=false)
     */
    public $userPassword;

    /**
     *
     * @var string
     * @Column(type="string", nullable=true)
     */
    public $userLastLogin;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=false)
     */
    public $userInvalidLoginAttempt;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    public $userLastPasswordChange;

    /**
     *
     * @var string
     * @Column(type="string", length=128, nullable=true)
     */
    public $userEmail;

    /**
     *
     * @var string
     * @Column(type="string", length=64, nullable=true)
     */
    public $userTeam;

    /**
     *
     * @var string
     * @Column(type="string", nullable=false)
     */
    public $createStatus;

    /**
     *
     * @var string
     * @Column(type="string", length=32, nullable=false)
     */
    public $createdBy;

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->setSchema("gpap");
        $this->setSource("user");
        $this->hasMany('userID', 'UserPrevPassword', 'userID', ['alias' => 'UserPrevPassword']);
        $this->hasMany('userID', 'UserRole', 'userID', ['alias' => 'UserRole']);

        $this->db = $this->getDI()->get('db');
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


    public static function findLastSixPasswords($conditions, $params = null)
    {
        $sql = "SELECT DISTINCT userPassword, userID " .
                "FROM user_prev_password " .
                "WHERE $conditions " .
                "AND userprevpasswordChange BETWEEN DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL -6 MONTH) AND CURRENT_TIMESTAMP() " .
                "UNION " .
                "SELECT DISTINCT userPassword, userid " .
                "FROM user " .
                "WHERE $conditions";

        $prevPassword = new UserPrevPassword();

        return new ResultSet(null, $prevPassword, $prevPassword->getReadConnection()->query($sql, $params));
    }

    public static function passwordDictCheck($params = null)
    {
        $sql = "SELECT dictionary.* 
                FROM dictionary 
                WHERE isCommon = true AND (INSTR(BINARY LOWER(?), LOWER(dictionaryWord))) > 0
                OR INSTR(REVERSE(BINARY LOWER(?)), REVERSE(LOWER(dictionaryWord))) > 0 
                OR INSTR(REVERSE(BINARY LOWER(?)),LOWER(dictionaryWord)) > 0 
                OR INSTR(LOWER(?), REVERSE(LOWER(dictionaryWord))) > 0";

        $dictionary = new Dictionary();
        
        return new ResultSet(null, $dictionary, $dictionary->getReadConnection()->query($sql, $params));
    }

    public static function trivialCheck($params = null)
    {
        $sql = "SELECT count(dictionaryid) 
                FROM dictionary 
                WHERE isCommon = false 
                AND (INSTR(BINARY LOWER(?), LOWER(dictionaryWord))) > 0
                OR INSTR(REVERSE(BINARY LOWER(?)), REVERSE(LOWER(dictionaryWord)))> 0 
                OR INSTR(REVERSE(BINARY LOWER(?)),LOWER(dictionaryWord))> 0 
                OR INSTR(LOWER(?), REVERSE(LOWER(dictionaryWord)))> 0;";

        $dictionary = new Dictionary();
        
        return new ResultSet(null, $dictionary, $dictionary->getReadConnection()->query($sql, $params));
    }

    public static function personalInfoCheck($params = null)
    {
        $sql = "SELECT POSITION(dictionaryWord IN '?') AS m FROM Dictionary HAVING m = 1";

        $dictionary = new Dictionary();
        
        return new ResultSet(null, $dictionary, $dictionary->getReadConnection()->query($sql, $params));
    }
}
