<?php

$router = $di->getRouter();

$router->add(
    '/{controller}/{id:\d+}',
    [
        'action' => 'index'
    ]
);

$router->handle();
