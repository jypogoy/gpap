<?php

use Phalcon\Di;
use Phalcon\Mvc\Model\Resultset\Simple as Resultset;

class User extends \Phalcon\Mvc\Model
{

    //protected $db;

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

        //$this->db = $this->getDI()->get('db');
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


    // public function isLastSixMatch($userId, $password)
    // {
    //     $db = Di::getDefault()['db'];
        
    //     $hasMatch = false;

    //     $sql = "SELECT DISTINCT userPassword, userID " .
    //             "FROM user_prev_password " .
    //             "WHERE userID = ? " .
    //             "AND userprevpasswordChange BETWEEN DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL -6 MONTH) AND CURRENT_TIMESTAMP() " .
    //             "UNION " .
    //             "SELECT DISTINCT userPassword, userid " .
    //             "FROM user " .
    //             "WHERE userID = ?";

    //     $result = $db->query($sql, [$userId, $userId]);        
    //     $result->setFetchMode(Phalcon\Db::FETCH_OBJ);

    //     // Match new password hash with the recorded passwords.
    //     $encPassword = $this->security->hash($password);
    //     // while ($password = $result->fetch()) {
    //     //     if($security->checkHash($encPassword, $password->userPassword)) {
    //     //         $hasMatch = true;
    //     //         break;
    //     //     }
    //     // }

    //     return $hasMatch;
    // }

    // public static function isUpdatedToday($userId)
    // {
    //     $count = self::count(
    //         [
    //             "conditions" => "DATEDIFF(now(),userLastPasswordChange) = 0 AND userID = ?1",
    //             "bind"       => [
    //                 1   =>  $userId
    //             ]
    //         ]
    //     );

    //     return $count > 0 ? true : false;
    // }

    // public static function isDictMatch($password)
    // {
    //     $sql = "SELECT dictionary.*
    //             FROM dictionary
    //             WHERE isCommon = true AND (INSTR(BINARY LOWER(?), LOWER(dictionaryWord))) > 0
    //             OR INSTR(REVERSE(BINARY LOWER(?)), REVERSE(LOWER(dictionaryWord))) > 0
    //             OR INSTR(REVERSE(BINARY LOWER(?)),LOWER(dictionaryWord)) > 0
    //             OR INSTR(LOWER(?), REVERSE(LOWER(dictionaryWord))) > 0";

    //     $result = self::$db->query($sql, [$password, $password, $password, $password]);

    //     return $result->numRows() > 0 ? true : false;
    // }

    // public static function isTrivial($password)
    // {
    //     $sql = "SELECT count(dictionaryid) AS total
    //             FROM dictionary
    //             WHERE isCommon = false
    //             AND (INSTR(BINARY LOWER('?'), LOWER(dictionaryWord))) > 0
    //             OR INSTR(REVERSE(BINARY LOWER('?')), REVERSE(LOWER(dictionaryWord)))> 0
    //             OR INSTR(REVERSE(BINARY LOWER('?')),LOWER(dictionaryWord))> 0
    //             OR INSTR(LOWER('?'), REVERSE(LOWER(dictionaryWord)))> 0";

    //     $result = $db->fetchOne($sql, [$password, $password, $password, $password]);
                    
    //     return intval($result->total) > 0 ? true : false;
    // }

    // public static function isPersonal($userId, $password)
    // {
    //     $sql = "SELECT userID,
    //                 POSITION(userName IN ?) AS m1,
    //                 POSITION(userLastName IN ?) AS m2,
    //                 POSITION(userFirstName IN ?) AS m3
    //             FROM user HAVING m1 > 0 OR m2 > 0 OR m3 > 0
    //             AND userID = " . $userId;

    //     $result = self::$db->query($sql, [$password, $password, $password]);
        
    //     return $result->numRows() > 0 ? true : false;
    // }
}
