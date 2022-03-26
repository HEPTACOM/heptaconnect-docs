# Portal node configuration

Portal node configuration are configured using command line commands and are persistent in the storage layer.
Common strategies to create staging, testing and development systems depend on configuration by environment variables.
Here you can learn how to switch portal node configuration by other configuration sources.
This page is separated in four sections to explain how to these few lines can configure a portal node by environment variables:

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

Config::replace('bottle', Config::helper()->env([
    'black' => 'PORTAL_BOTTLE_BLACK',
]));
```

1. [How to use in my project?](#bridge-support)
2. [How to identity a portal node to configure?](#portal-node-query)
3. [Where to load data from?](#configuration-sources)
4. [How to combine different sources?](#configuration-chain)


## Bridge support

Depending on the bridge you choose the configuration differs.
You will probably find your use-case below and copy the requirements.
Ensure to document the newly integrated configuration sources, so you can get new persons aboard nicely.


### Shopware 6

The Shopware bridge by default ships with a services that collects configuration source services by tagged services.
This allows for a few changes to introduce new configuration sources.
The following example shows what you need to add portal node configuration by a short-notation configuration script.


=== "config/services.yaml"

    ```yaml
    Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\InstructionFileLoader:
        tags:
            - { name: heptaconnect_core.portal_node_configuration.instruction_file_loader }
        arguments:
            - '%kernel.project_dir%/config/portal-node-config.php'
    ```

=== "config/services.xml (alternative)"

    ```xml
    <?xml version="1.0" ?>
    <container
        xmlns="http://symfony.com/schema/dic/services"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd"
    >
        <services>
            <service id="Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\InstructionFileLoader">
                <tag name="heptaconnect_core.portal_node_configuration.instruction_file_loader"/>
                <argument>%kernel.project_dir%/config/portal-node-config.php</argument>
            </service>
        </services>
    </container>
    ```

###### config/portal-node-config.php

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

// TODO enter your Config:: instructions
```


## Portal node query

Portal nodes that shall be affected by the configuration instructions can be matched against different queries.
The query to match against is the first parameter in every configuration instruction.


### Portal class

You can identify a portal node by its class.
This query will match every portal node of the same type and can be used to change configuration for multiple portal nodes at once.
The referenced class does not need to be the portal class itself but can be anything extended class name or interface that is related to the portal class of the portal node.

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;
use Heptacom\HeptaConnect\Playground\Portal\BottlePortal;

Config::replace(BottlePortal::class, [
    'black' => '#111111',
]);
```


### Portal extension class

You can identify a portal node by its active portal extensions.
This query will match every portal node that has a certain activated portal extension attached to it and can be used to change configuration for multiple portal nodes at once.
The referenced class does not need to be the portal extension class itself but can be anything extended class name or interface that is related to the portal extension class of the portal node.

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;
use Heptacom\HeptaConnect\Playground\PortalExtension\BottleContent;

Config::replace(BottleContent::class, [
    'contentFactor' => 1.0,
]);
```


### Portal node key

You can identify a portal node by its key given in the storage layer.
This key can be seen when creating a portal node or listing the portal nodes.
Using the portal node key is the most specific way to configure a portal node.
Therefore, this only works with an existing database.

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

Config::replace('PortalNode:1234567890', [
    'black' => '#111111',
]);
```


### Portal node alias

You can identify a portal node by its alias.
The portal node alias points to a portal node key and is unique as well.
This key can be defined when creating a portal node or seen when listing the portal nodes.

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

Config::replace('bottle', [
    'black' => '#111111',
]);
```


## Configuration sources

As seen in the initial configuration for the support of your integration, configuration happens on PHP level.
PHP as configuration source is the most versatile.
To simplify usage of other sources you have the following tooling available:


### Environment variables

Environment variables are the most common alternative configuration source.

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

$mapping = [
    'username' => 'PORTAL_A_USERNAME',
    'password' => 'PORTAL_A_PASSWORD',
];
$source = Config::helper()->env($mapping);
```

With the mapping array you can provide a reusable pattern, where to fetch data from.
It is equivalent to:

```php
<?php

$source = [
    'username' => getenv('PORTAL_A_USERNAME'),
    'password' => getenv('PORTAL_A_PASSWORD'),
];
```


### Array

Restructuring arrays is a flexible way to introduce various configuration sources.
In the example is a statically provided `$data` variable.
This can be loaded on different ways.

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

$data = [
    'list' => [1, 2, 3],
    'assoc' => [
        'key' => 'value',
        'secret' => 'letmein',
    ],
    'not' => 'needed',
];
$mapping = [
    'username' => 'assoc.key',
    'password' => 'assoc.secret',
    'logging' => [
        'levels' => 'list',
    ],
];
$source = Config::helper()->array($data, $mapping);
```

With the mapping array you can provide a reusable pattern, where to fetch data from.
It is equivalent to:

```php
<?php

$data = [
    'list' => [1, 2, 3],
    'assoc' => [
        'key' => 'value',
        'secret' => 'letmein',
    ],
    'not' => 'needed',
];
$source = [
    'username' => $data['assoc']['key'] ?? null,
    'password' => $data['assoc']['secret'] ?? null,
    'logging' => [
        'levels' => $data['list'] ?? null,
    ],
];
```


### JSON

JSON files are handled very similar compared to [arrays as source](#array).
The source only refers to a file instead of static data.

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

$mapping = [
    'username' => 'assoc.key',
    'password' => 'assoc.secret',
    'logging' => [
        'levels' => 'list',
    ],
];
$source = Config::helper()->json(__DIR__ . '/config.json', $mapping);
```


### INI

INI files are handled very similar compared to [arrays as source](#array).
The source only refers to a file instead of static data.

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

$mapping = [
    'username' => 'assoc.key',
    'password' => 'assoc.secret',
    'logging' => [
        'levels' => 'list',
    ],
];
$source = Config::helper()->ini(__DIR__ . '/config.ini', $mapping);
```


## Configuration chain

Every instruction you make in the short-notation is processed in order of definition.
The very first source is the cached access of reading the storage layer.
After that every manipulation that matches the portal node query is applied in a decoration chain.
Each data source referenced in the instruction can be:

* either a `Closure` to reference data pulled from a data store that must not be queried on definition
* or an `array` of statically provided data


### Set configuration

The `set` instruction is the most versatile instruction.
With great versatility comes great responsibility.
This set instruction will break the configuration chain when used with static data or a closure that does not call the next step:

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

Config::set('bottle', [
    'black' => '#111111',
]);
```

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

Config::set('bottle', static fn (Closure $next) => [
    'black' => '#111111',
]);
```

This means that you can prevent loading from the storage layer entirely.


### Merge configurations

The `merge` instruction is a short-notation for a chaining [set instruction](#set-configuration) with `array_merge` and `array_merge_recursive`.
If not configured differently `array_merge_recursive` is used.

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

Config::set('bottle', static fn (Closure $next) => \array_merge_recursive(
    $next(),
    [
        'black' => '#111111',
    ]
));
Config::merge('bottle', [
    'black' => '#111111',
]);
```


### Replace configurations

The `replace` instruction is a short-notation for a chaining [set instruction](#set-configuration) with `array_replace` and `array_replace_recursive`.
If not configured differently `array_replace_recursive` is used.

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

Config::set('bottle', static fn (Closure $next) => \array_replace_recursive(
    $next(),
    [
        'black' => '#111111',
    ]
));
Config::replace('bottle', [
    'black' => '#111111',
]);
```


### Reset configurations

The `reset` instruction is a short-notation for a chaining [set instruction](#set-configuration) with a mapped calls of unset to remove data from the previous configuration.

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Core\Bridge\PortalNode\Configuration\Config;

Config::reset('bottle', static function (Closure $next) {
    $previous = $next();
    unset($previous['black']);
    return $previous;
});
Config::reset('bottle', ['black']);
```
