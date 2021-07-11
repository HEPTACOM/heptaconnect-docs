{
    "date": "2021-07-12",
    "title": "Short notation for flow components",
    "summary": "Gain more ",
    "author": "Joshua Behrens"
}
---

## TL;DR

Write less. \
Achieve more in less time. \
Look at your results faster.

Read more about [short notation for flow components](https://connect.heptacom.de/#/portal-development/017-short-notation-for-flow-components).


## Preamble

No, the **TL;DR** is not a copy mistake from the [previous feed entry about dependency injection](https://connect.heptacom.de/#/feed/2021-06-21-symfony-dependency-injection).
We once more achieved to improve the developer experience by adding more tools to reduce your boilerplate code.
Summarizing our [ADR](https://connect.heptacom.de/#/adr/2021-06-17-flow-component-short-notation) you can now stop writing **sections** of code and start to write **lines** of code.
Previously you had to write:

```php
<?php

declare(strict_types=1);

namespace FooBar\Emitter;

use FooBar\Packer\BottlePacker;
use FooBar\Service\ApiClient;
use Heptacom\HeptaConnect\Dataset\Base\Contract\DatasetEntityContract;
use Heptacom\HeptaConnect\Portal\Base\Emission\Contract\EmitContextInterface;
use Heptacom\HeptaConnect\Portal\Base\Emission\Contract\EmitterContract;

class BottleEmitter extends EmitterContract
{
    private ApiClient $client;
    
    private BottlePacker $packer;
    
    public function __construct(ApiClient $client, BottlePacker $packer)
    { 
        $this->client = $client;
        $this->packer = $packer;
    }

    public function run(string $externalId, EmitContextInterface $context) : ?DatasetEntityContract
    {
        return $this->packer->pack($this->client->getBottleData($externalId));
    }
}
```

Sieve out the boilerplate lines and you have:

```php
<?php

declare(strict_types=1);

use FooBar\Packer\BottlePacker;
use FooBar\Service\ApiClient;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;

FlowComponent::emitter(Bottle::class)->run(
    fn (ApiClient $client, BottlePacker $packer, string $id) => $packer->pack($client->getBottleData($id))
);
```

When this reminds you of Laravel routes and commands, you are right.
This is heavily inspired by Laravel's nature of quickly scribbling down some lines to get something big running.
To get an overview of the short notation and how to use it visit [the documentation page](https://connect.heptacom.de/#/portal-development/017-short-notation-for-flow-components).
