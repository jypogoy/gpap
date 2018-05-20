<?php

use Phalcon\Mvc\View;
use Phalcon\Mvc\View\Engine\Php as PhpEngine;
use Phalcon\Mvc\Url as UrlResolver;
use Phalcon\Mvc\View\Engine\Volt as VoltEngine;
use Phalcon\Mvc\Model\Metadata\Memory as MetaDataAdapter;
use Phalcon\Session\Adapter\Files as SessionAdapter;
use Phalcon\Flash\Direct as Flash;
use Phalcon\Mvc\Dispatcher;
use Phalcon\Events\Manager as EventsManager;
use Phalcon\Mvc\Model\Manager as ModelsManager;
use Phalcon\Crypt;
use Phalcon\Logger;
use Phalcon\Logger\Adapter\File as FileAdapter;
use Phalcon\Logger\Formatter\Line as FormatterLine;

/**
 * Register the events manager
 */
$di->set('dispatcher', function () {
    $eventsManager = new EventsManager;

    /**
     * Check if the user is allowed to access certain action using the SecurityPlugin
     */
    $eventsManager->attach('dispatch:beforeExecuteRoute', new SecurityPlugin);

    /**
     * Handle exceptions and not-found exceptions using NotFoundPlugin
     */
    $eventsManager->attach('dispatch:beforeException', new NotFoundPlugin);

    $dispatcher = new Dispatcher;
    $dispatcher->setEventsManager($eventsManager);

    return $dispatcher;
});

/**
 * Shared configuration service
 */
$di->setShared('config', function () {
    return include APP_PATH . "/config/config.php";
});

/**
 * The URL component is used to generate all kind of urls in the application
 */
$di->setShared('url', function () {
    $config = $this->getConfig();

    $url = new UrlResolver();
    $url->setBaseUri($config->application->baseUri);

    return $url;
});

/**
 * Setting up the view component
 */
$di->setShared('view', function () {
    $config = $this->getConfig();

    $view = new View();
    $view->setDI($this);
    $view->setViewsDir($config->application->viewsDir);

    $view->registerEngines([
        '.volt' => function ($view) {
            $config = $this->getConfig();

            $volt = new VoltEngine($view, $this);

            $volt->setOptions([
                'compiledPath' => $config->application->cacheDir,
                'compiledSeparator' => '_',
                'compileAlways'     => true // Set to FALSE or remove in PRODUCTION. Compiles templates in each request or only when they change. 
            ]);

            // Enable macro calls
            $compiler = $volt->getCompiler();
            $compiler->addFunction('is_a', 'is_a');    

            return $volt;
        },
        '.phtml' => PhpEngine::class

    ]);

    return $view;
});

/**
 * Database connection is created based in the parameters defined in the configuration file
 */
$di->setShared('db', function () {
    $config = $this->getConfig();

    $class = 'Phalcon\Db\Adapter\Pdo\\' . $config->database->adapter;
    $params = [
        'host'     => $config->database->host,
        'username' => $config->database->username,
        'password' => $config->database->password,
        'dbname'   => $config->database->dbname,
        'charset'  => $config->database->charset,
        // 'options'  => array(
        //     //PDO::ATTR_PERSISTENT        => 1,
        //     PDO::MYSQL_ATTR_SSL_KEY     => 'C:\Users\jeffrey.pogoy\Downloads\MariaDB Certs\client-key.pem',
        //     PDO::MYSQL_ATTR_SSL_CERT    => 'C:\Users\jeffrey.pogoy\Downloads\MariaDB Certs\client-cert.pem',
        //     PDO::MYSQL_ATTR_SSL_CA      => 'C:\Users\jeffrey.pogoy\Downloads\MariaDB Certs\ca-cert.pem'
        // )
    ];

    if ($config->database->adapter == 'Postgresql') {
        unset($params['charset']);
    }

    $connection = new $class($params);

    // Logger to view executed queries in runtime  
    $path = rtrim($config->get('log_settings')->path, '\\/') . DIRECTORY_SEPARATOR;  
    $logger = new \Phalcon\Logger\Adapter\File($path . $config->log_filenames->sql);
    $eventsManager = new \Phalcon\Events\Manager();
    $eventsManager->attach('db', function($event, $connection) use ($logger) {
        if ($event->getType() == 'beforeQuery') $logger->log($connection->getSQLStatement());
        // . ' ' . join(', ', $connection->getSQLVariables()));
    });
    $connection->setEventsManager($eventsManager);

    return $connection;
});

/**
 * Logger service
 */
$di->set('logger', function ($filename = null) {
    $config = $this->getConfig();
    $format   = $config->get('log_settings')->format;
    //$filename = trim($filename ?: $config->get('log_filenames')->common, '\\/');
    $path     = rtrim($config->get('log_settings')->path, '\\/') . DIRECTORY_SEPARATOR;
    $formatter = new FormatterLine($format, $config->get('log_settings')->date);    
    $logger    = new FileAdapter($path . $filename);
    $logger->setFormatter($formatter);
    $logger->setLogLevel($config->get('log_settings')->logLevel);
    return $logger;
});

$di->set('sessionLogger', function () {
    $config = $this->getConfig();
    $filename = trim($config->get('log_filenames')->session, '\\/');
    return $this->get('logger', array($filename));
});

$di->set('commonLogger', function () {
    $config = $this->getConfig();
    $filename = trim($config->get('log_filenames')->common, '\\/');
    return $this->get('logger', array($filename));
});

$di->set('deLogger', function () {
    $config = $this->getConfig();
    $filename = trim($config->get('log_filenames')->de, '\\/');
    return $this->get('logger', array($filename));
});

$di->set('errorLogger', function () {
    $config = $this->getConfig();
    $filename = trim($config->get('log_filenames')->error, '\\/');
    return $this->get('logger', array($filename));
});

/**
 * If the configuration specify the use of metadata adapter use it or use memory otherwise
 */
$di->setShared('modelsMetadata', function () {
    return new MetaDataAdapter();
});

/**
 * 
 */
$di->set('modelsManager', function () {
    return new ModelsManager();
});

/**
 * Register the session flash service with the Twitter Bootstrap classes
 */
$di->set('flash', function () {
    return new Flash([
        'error'   => 'ui hidden error message',
        'success' => 'ui hidden success message',
        'notice'  => 'ui hidden info message',
        'warning' => 'ui hidden warning message'
    ]);
});

/**
 * Start the session the first time some component request the session service
 */
$di->setShared('session', function () {

    // Set the max lifetime of a session with 'ini_set()' to 1 hour
    //ini_set('session.gc_maxlifetime', 3600);
    
    // Each client should remember their session id for EXACTLY 1 hour
    //session_set_cookie_params(3600);
    
    // Start session with Phalcon
    $session = new SessionAdapter(
        [
            'uniqueId' => 'gpap',
        ]
    );
    $session->start();

    return $session;
});

/**
 * Crypt service
 */
$di->set('crypt',
    function () {
        $crypt = new Crypt();

        // Set a global encryption key
        $crypt->setKey(
            '%31.1e$i86e$f!8jz'
        );

        // Set the applicable cipher method. Default is AES-256-CFB. 
        // See http://php.net/manual/en/function.openssl-get-cipher-methods.php for more.
        //$crypt->setCipher('AES-256-CBC');

        return $crypt;
    },
    true
);

$di->set('utils', function () {
    return new Utils();
});

$di->set('elements', function () {
    return new Elements();
});

$di->set('listing', function () {
    return new Listing();
});

$di->set('alert', function () {
    return new Alert();
});

$di->set('modals', function () {
    return new Modals();
});