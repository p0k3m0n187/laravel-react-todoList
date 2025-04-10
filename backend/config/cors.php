<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | These are the domains that are allowed to make requests to your
    | application. You can set this to '*' to allow all domains.
    |
    */

    'supportsCredentials' => true,
    'allowedOrigins' => ['*'],
    'allowedOriginsPatterns' => [],
    'allowedHeaders' => ['*'],
    'allowedMethods' => ['*'], // Allow all HTTP methods
    'exposedHeaders' => [],
    'maxAge' => 0,
];

