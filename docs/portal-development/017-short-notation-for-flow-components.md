# Short notation for flow components

Flow components that have been described in the previous pages can also be written in a callback registration pattern.
This is very useful short notation to reduce boilerplate code that is only needed to "wire" the API connecting services to the flow components.
To learn more about the decisions behind this feature have a look at the related [ADR](../adr/2021-06-17-flow-component-short-notation.md).


## How to use

For this feature a plain php file within the folder `src/Resources/flow-component/` is expected:

```
<portal-dir>
├── composer.json
└── src
    └── Resources
        └── flow-component
            └── foobar.php
```

`foobar.php` will be loaded and uses a newly introduced `FlowComponent` building utility.
Every callback that is given into that builder can make use of every [dependency injection](./015-dependency-injection.md) feature.
The following section will show how to use each flow component with a file accessing scenario. 


## Explorer

Click [here](./002-explorer.md) to see the object-oriented notation.

```php
<?php

use Heptacom\HeptaConnect\Playground\Dataset\Bottle;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use League\Flysystem\FilesystemInterface;

FlowComponent::explorer(Bottle::class)
    ->run(fn (FilesystemInterface $fs): iterable => array_column($fs->listContents(), 'path'));

FlowComponent::explorer(Bottle::class)
    ->isAllowed(fn (FilesystemInterface $fs, string $id): bool => $fs->getSize($id) > 0);
```


## Emitter

Click [here](./003-emitter.md) to see the object-oriented notation.

```php
<?php

use FooBar\Packer\BottlePacker;
use Heptacom\HeptaConnect\Playground\Dataset\Bottle;
use Heptacom\HeptaConnect\Playground\Dataset\Volume;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use League\Flysystem\FilesystemInterface;

FlowComponent::emitter(Bottle::class)
    ->run(fn (FilesystemInterface $fs, BottlePacker $packer, string $id): ?Bottle => $packer->pack($fs->read($id) ?: null));

FlowComponent::emitter(Bottle::class)
    ->extend(fn (FilesystemInterface $fs, Bottle $bottle): ?Bottle => $bottle->setCapacity(
        (new Volume())
            ->setAmount($fs->getSize($bottle->getPrimaryKey()))
            ->setUnit('byte')
    ));
```


## Receiver

Click [here](./004-receiver.md) to see the object-oriented notation.

```php
<?php

use FooBar\Unpacker\BottleUnpacker;
use Heptacom\HeptaConnect\Playground\Dataset\Bottle;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use League\Flysystem\FilesystemInterface;

FlowComponent::receiver(Bottle::class)
    ->run(function (FilesystemInterface $fs, BottleUnpacker $unpacker, Bottle $bottle): void {    
        ['id' => $id, 'payload' => $payload] = $unpacker->unpack($bottle);
        $fs->write($id, $payload);
    });
```


## Status reporter

Click [here](./009-status-reporting.md) to see the object-oriented notation.

```php
<?php

use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use League\Flysystem\FilesystemInterface;

FlowComponent::statusReporter('health')
    ->run(function (FilesystemInterface $fs): bool => !empty($fs->listContents()));

FlowComponent::statusReporter('info')
    ->run(function (FilesystemInterface $fs): array => [
        'count' => count($fs->listContents()),
    ]);
```
