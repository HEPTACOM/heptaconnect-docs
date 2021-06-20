# How to be a HEPTAconnect portal developer

This is all about the guidelines to structure a portal or portal extensions.
Be sure to know the general thoughts and requirements to be a [HEPTAconnect developer](./001-core-development.md) and have a basic understanding what a dataset is and what it means to [develop one](./002-dataset-development.md).

## Composer
f
It is mandatory to add the keyword `heptaconnect-portal` to the composer package that provides one or more portals.
This way HEPTAconnect can find your portal and register portal nodes for it.
Also more people can easily find your portal on packagist.
A common `composer.json` for a portal providing package may look like this:

```json
{
    "name": "acme/heptaconnect-portal-bottle",
    "description": "HEPTAconnect portal to provide bottles",
    "type": "library",
    "keywords": [
        "heptaconnect-portal"
    ],
    "require": {
        "php": ">=7.4",
        "acme/heptaconnect-dataset-bottle": ">=1",
        "heptacom/heptaconnect-portal-base": ">=1"
    },
    "autoload": {
        "psr-4": {
            "Acme\\Portal\\Bottle\\": "src/"
        }
    },
    "extra": {
        "heptaconnect": {
            "portals": [
                "Acme\\Portal\\Bottle\\BottlePortal"
            ]
        }
    }
}
```

## Structure

The entry point of your portal is an implementation of the `PortalContract`.
It can implement a method to provide a configuration template or some custom methods to use in your flow components.
None of these methods are mandatory, therefore the minimum valid portal class would look like this:

```php
namespace Acme\Portal\Bottle;

use Heptacom\HeptaConnect\Portal\Base\Portal\Contract\PortalContract;

class BottlePortal extends PortalContract
{
}
```

A receiver that gets data from HEPTAconnect is to be told to communicate towards the API it wraps.
A common implementation is to use a custom API client and let the receiver do the translation work from dataset structures to API structures:

```php
namespace Acme\Portal\Bottle\Receiver;

use Acme\Portal\Bottle\Http\ApiClient;
use Heptacom\HeptaConnect\Dataset\Base\Contract\DatasetEntityContract;
use Heptacom\HeptaConnect\Playground\Dataset\Bottle;
use Heptacom\HeptaConnect\Portal\Base\Reception\Contract\ReceiveContextInterface;
use Heptacom\HeptaConnect\Portal\Base\Reception\Contract\ReceiverContract;
use Ramsey\Uuid\Uuid;

class BottleReceiver extends ReceiverContract
{
    /**
     * @param Bottle $entity  
     */
    protected function run(DatasetEntityContract $entity, ReceiveContextInterface $context): void
    {
        // get API client to send the data to
        $apiClient = new ApiClient();

        // either the entity already has an ID or we create a new one
        $id = $entity->getPrimaryKey() ?? Uuid::uuid4()->toString();
        
        // translate entity to arbitrary structure and send it to the API
        $apiClient->upsert([
            'id' => $id,
            'cap' => $entity->getCap()->getType(),
            'volume' => $entity->getCapacity()->getAmount(),
        ]);
        
        // save the primary key, so a mapping is created
        $entity->setPrimaryKey($id);
    }

    public function supports(): string
    {
        // tells HEPTAconnect to use this receiver for bottles
        return Bottle::class;
    }
}
``` 

As we just read how a receiver is reduced to the case of communication we can compare it to an emitter that loads data from an API and feeds it into HEPTAconnect.

```php
namespace Acme\Portal\Bottle\Emitter;

use Acme\Portal\Bottle\Http\ApiClient;
use Heptacom\HeptaConnect\Dataset\Base\Contract\DatasetEntityContract;
use Heptacom\HeptaConnect\Playground\Dataset\Bottle;
use Heptacom\HeptaConnect\Playground\Dataset\Cap;
use Heptacom\HeptaConnect\Playground\Dataset\Volume;
use Heptacom\HeptaConnect\Portal\Base\Emission\Contract\EmitContextInterface;
use Heptacom\HeptaConnect\Portal\Base\Emission\Contract\EmitterContract;

class BottleEmitter extends EmitterContract
{
    protected function run(string $externalId, EmitContextInterface $context): ?DatasetEntityContract
    {
        // get API client to read the data from
        $apiClient = new ApiClient();
 
        // read data from API client
        $data = $apiClient->select($externalId);

        if (\count($data) === 0) {
            return null;
        }           

        // translate arbitrary data structure to entity
        return (new Bottle())
            ->setCap((new Cap())->setType($data['cap']))
            ->setCapacity((new Volume())
                ->setAmount($data['volume'])
                ->setUnit(Volume::UNIT_LITER)
            )
        ;
    }

    public function supports(): string
    {
        // tells HEPTAconnect to use this emitter for bottles
        return Bottle::class;
    }
}
```

## Expose status for administration

As the portal node is about to get setup or is in usage an administrator needs to find out about its status regarding a correct configuration or the connectivity state of the underlying data source.
A status reporter is meant to get information about a certain topic.
Every portal should expose a health status reporter and when a data source is used that depends on I/O operations like file or network access.

```php
namespace Acme\Portal\Bottle\StatusReporter;

use Acme\Portal\Bottle\Http\ApiClient;
use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReporterContract;
use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReportingContextInterface;

class BottleHealthStatusReporter extends StatusReporterContract
{
    public function supportsTopic(): string
    {
        return self::TOPIC_HEALTH;
    }

    public function run(StatusReportingContextInterface $context): array
    {
        // get API client
        $apiClient = new ApiClient();

        return [
            $this->supportsTopic() => true,
            'bottleCount' => $apiClient->count(),
        ];
    }
}
```

## Extend portals via attachments

A dataset sometimes is not able to hold data that is needed for an integration to work.
The dataset author might have not thought of this case or evaluated it as an edge case.
In these situations you are about to create an emitter decorator via a portal extension.
A portal extension is published similar to a portal via the extra section in a composer package.

```json
{
    "name": "acme/heptaconnect-portal-bottles-with-content",
    "description": "HEPTAconnect portal extension to provide content for bottles",
    "type": "library",
    "keywords": [
        "heptaconnect-portal-extension"
    ],
    "require": {
        "php": ">=7.4",
        "acme/heptaconnect-portal-bottle": ">=1",
        "acme/heptaconnect-dataset-bottle": ">=1",
        "heptacom/heptaconnect-portal-base": ">=1"
    },
    "autoload": {
        "psr-4": {
            "Acme\\PortalExtension\\Bottle\\": "src/"
        }
    },
    "extra": {
        "heptaconnect": {
            "portalExtensions": [
                "Acme\\PortalExtension\\Bottle\\BottlesWithContentPortal"
            ]
        }
    }
}
```

The portal extension has to specify which portal it extends:

```php
namespace Acme\PortalExtension\Bottle;

use Acme\Portal\Bottle\BottlePortal;
use Heptacom\HeptaConnect\Portal\Base\Portal\Contract\PortalExtensionContract;

class BottlesWithContentPortal extends PortalExtensionContract
{
    public function supports(): string
    {
        return BottlePortal::class;
    }
}
```

The emitter decorator will be injected into the call chain and can now alter the mappings to be read from the original and add new data.

```php
namespace Acme\PortalExtension\Bottle\Emitter;

use Acme\Portal\Bottle\Http\ApiClient;
use Heptacom\HeptaConnect\Dataset\Base\Contract\DatasetEntityContract;
use Heptacom\HeptaConnect\Playground\Dataset\Bottle;
use Heptacom\HeptaConnect\Playground\Dataset\Volume;
use Heptacom\HeptaConnect\Playground\PortalExtension\Dataset\BottleContent;
use Heptacom\HeptaConnect\Portal\Base\Emission\Contract\EmitContextInterface;
use Heptacom\HeptaConnect\Portal\Base\Emission\Contract\EmitterContract;

class BottleWithContentEmitter extends EmitterContract
{
    protected function extend(
        DatasetEntityContract $entity,
        EmitContextInterface $context
    ) : DatasetEntityContract {
        // get API client
        $apiClient = new ApiClient();

        // read extra data from the API client
        $data = $apiClient->selectContentData($entity->getPrimaryKey());

        if (\count($data) > 0) {
            // assign extra data to the already emitted entity
            $content = (new BottleContent())
                ->setContent(
                    (new Volume)
                        ->setAmount($data['content'])
                        ->setUnit(Volume::UNIT_LITER)
                );
            $entity->attach($content);
        }

        return $entity;
    }

    public function supports(): string
    {
        // tells HEPTAconnect to use this emitter for bottles
        return Bottle::class;
    }
}
```
