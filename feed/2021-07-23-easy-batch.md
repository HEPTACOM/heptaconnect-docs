{
    "date": "2021-07-23",
    "title": "Easy batch just like step-by-step runs",
    "summary": "Convert your single runs into batch runs more easily and gain performance",
    "author": "Joshua Behrens"
}
---

## TL;DR

Train in step-by-step. \
Run in batches.

Read more about the way how to batch in [short notation for flow components](https://connect.heptacom.de/#/portal-development/017-short-notation-for-flow-components) and flow components like [emitter](https://connect.heptacom.de/#/portal-development/003-emitter) and [receiver](https://connect.heptacom.de/#/portal-development/004-receiver).


## Batches and step by step runs

Every emitting or receiving flow component can improve on performance when data is processed in batches.
In general HEPTAconnect groups data into batches to allow the flow components to be able to act in reasonable batch sizes.
The documentation in the past only explained how to make a single step-by-step API interactions.
Running through a data transfer in such a sequential manner is due to its complexity better to outline its inner statements.
The flow component loops that unrolled the batches into single steps are now accessible for child classes to override.
Compare the following real life examples how to receive manufacturer data to its successor within Shopware 6:

```php
<?php

use Heptacom\HeptaConnect\Dataset\Ecommerce\Product\Manufacturer;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use Heptacom\HeptaConnect\Portal\LocalShopwarePlatform\Support\DalAccess;
use Heptacom\HeptaConnect\Portal\LocalShopwarePlatform\Unpacker;

FlowComponent::receiver(Manufacturer::class)->run(static fn (
    DalAccess $dal,
    Manufacturer $manufacturer,
    Unpacker\ManufacturerUnpacker $unpacker
) => $dal->createSyncer()->upsert('product_manufacturer', [$unpacker->unpack($manufacturer)])->flush());
```

```php
<?php

use Heptacom\HeptaConnect\Dataset\Base\TypedDatasetEntityCollection;
use Heptacom\HeptaConnect\Dataset\Ecommerce\Product\Manufacturer;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use Heptacom\HeptaConnect\Portal\LocalShopwarePlatform\Support\DalAccess;
use Heptacom\HeptaConnect\Portal\LocalShopwarePlatform\Unpacker;

FlowComponent::receiver(Manufacturer::class)->batch(static fn (
    DalAccess $dal,
    TypedDatasetEntityCollection $manufacturers,
    Unpacker\ManufacturerUnpacker $unpacker
) => $dal->createSyncer()->upsert('product_manufacturer', $manufacturers->map([$unpacker, 'unpack']))->flush());
```

There is basically no difference.
Your project can make use of this today when you are in the lucky position to have a batch-ready API, and you've been following architectural patterns to use packer and unpacker services. 
