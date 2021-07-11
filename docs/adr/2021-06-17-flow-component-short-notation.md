# 2021-06-17 - Flow component short notation

## Context

When a portal has its code separated into different domains, many flow components will look like this:

```php
<?php

define(string_types=1);

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

This sample emitter of about 30 lines of code only consists of, when trimmed down to the essentials, two lines of instructions.

Acquisition of dependencies:

```php
public function __construct(ApiClient $client, BottlePacker $packer/*, string $externalId*/)
```

Wiring everything into an emitter run method:

```php
return $this->packer->pack($this->client->getBottleData($externalId));
```

Using this perspective we have 28 lines of code that are basically boilerplate.
Boilerplate code is code we want to eliminate.


## Decision

* Allow declaration of flow components in a callback registration way.


## Consequences

* There are now two places that can define flow components


### Pros

* Portal developers can wire their API clients to HEPTAconnect infrastructure in a very efficient way
    * Not extending certain classes
    * Storing services dependencies in fields
    * Dropping unused default parameters (like `$context`)
* Portal developers do not have to use them

### Cons

* Although discouraged, it is not possible to decorate the generated flow component services as the id naming is not predictable
* Code that follows PSR-4 is next to plain code in the same directory hierarchy
* The generated flow components can't make use of class inheritance features


## Additional thoughts

This developer experience is heavily inspired from Laravel route definitions.
Mixing PSR-4 compliant code with plain php is also done like this in Symfony bundles.
