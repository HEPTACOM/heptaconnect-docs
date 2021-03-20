# How to be a HEPTAconnect portal developer

This is all about the guidelines to structure a portal or portal extensions. Be sure to know then general thoughts and requirements to be a [HEPTAconnect developer](./001-core-development.md) and have a basic understanding what a dataset is and what it means to [develop one](./002-dataset-development.md).

## Composer

It is recommended to add the keyword `heptaconnect-portal` to the composer package that provides one or more portals. This way more people can easily find your portal on packagist. A common `composer.json` for a portal providing package may look like this:

```json
{
    "name": "acme/heptaconnect-portal-bottle",
    "description": "HEPTAconnect portal to provide bottles from bottles.local",
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
                "Acme\\Portal\\Bottle\\BottlesLocalPortal"
            ]
        }
    }
}
```

## Structure

A portal provides several emitters and receivers to communicate a certain set of dataset entities from an API towards HEPTAconnect and back. In the case of the bottle dataset we need an emitter and receiver to transfer bottle data. The portal class that is referenced in the composer json extra populates every class that shall be part of the HEPTAconnect processes:

```php
class BottlesLocalPortal extends PortalContract
{
    public function getExplorers(): ExplorerCollection
    {
        return new ExplorerCollection([
            new BottleExplorer(),
        ]);
    }

    public function getEmitters(): EmitterCollection
    {
        return new EmitterCollection([
            new BottleEmitter(),
        ]);
    }

    public function getReceivers(): ReceiverCollection
    {
        return new ReceiverCollection([
            new BottleReceiver(),
        ]);
    }

    public function getStatusReporters(): StatusReporterCollection
    {
        return new StatusReporterCollection([
            new BottleHealthStatusReporter(),
        ]);
    }

    /**
     * This method is unique for this portal implementation.
     * It is not defined in the PortalContract.
     */
    public function getApiClient(array $config): AcmeApiClient
    {
        // create and configure api client
        return new AcmeApiClient();
    }
}
```

A receiver gets data from HEPTAconnect is to be told to communicate towards the API it wraps. A common implementation is to let the portal provide an custom API client and let the receiver do the translation work from dataset structures to API structures:

```php
class BottleReceiver extends ReceiverContract
{
    /**
     * @param Bottle $entity  
     */
    protected function run(
        MappingInterface $mapping,
        DatasetEntityInterface $entity,
        ReceiveContextInterface $context
    ): void {
        $portal = $context->getContainer()->get('portal');
        $id = $mapping->getExternalId() ?? Uuid::uuid4()->toString();
        // get portal specific API client to communicate the data from the contexts configuration
        $portal->getApiClient($context->getConfig($mapping))->upsert([
            'id' => $id,
            'cap' => $entity->getCap()->getType(),
            'volume' => $entity->getCapacity()->as(Liter::class),
        ]);
        
        // mark the mapping as successfully transferred 
        $mapping->setExternalId($id);
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
class BottleEmitter extends EmitterContract
{
    protected function run(MappingInterface $mapping, EmitContextInterface $context): ?DatasetEntityInterface
    {        
        $portal = $context->getContainer()->get('portal');
        // get portal specific API client to communicate the data from the contexts configuration
        $data = $portal->getApiClient($context->getConfig($mapping))->select($mapping->getExternalId());

        if (\count($data) === 0) {
            return null;
        }           

        return (new Bottle())
            ->setCap((new Cap())->setName($data['cap']))
            ->setCapacity(new Liter($data['volume']));
    }

    public function supports(): string
    {
        // tells HEPTAconnect to use this emitter for bottles
        return Bottle::class;
    }
}
```

## Expose status for administration

As the portal node is about to get setup or is in usage an administrator needs to find out about its status regarding a correct configuration or the connectivity state of the underlying datasource. A status reporter is meant to get information about a certain topic. Every portal should expose a health status reporter and when a data source is used that depends on I/O operations like file or network access.   

```php
class BottleHealthStatusReporter extends StatusReporterContract
{
    public function supportsTopic(): string
    {
        return self::TOPIC_HEALTH;
    }

    public function run(StatusReportingContextInterface $context): array
    {
        $portal = $context->getContainer()->get('portal');

        return [
            $this->supportsTopic() => true,
            'bottleCount' => $portal->getApiClient($context->getConfig())->count(),
        ];
    }
}
```

## Extend portals via attachments

A dataset sometimes is not able to hold data that is needed for an integration to work. The dataset author might have not thought of this case or evaluated it as an edge case. In these situations you are about to create an emitter decorator via a portal extension. A portal extension is published similar to a portal via the extra section in a composer package.

```json
{
    "keywords": [
        "heptaconnect-portal-extension"
    ],
    "require": {
        "acme/heptaconnect-portal-bottle": ">=1"
    },
    "extra": {
        "heptaconnect": {
            "portalExtensions": [
                "Acme\\Portal\\Bottle\\BottlesWithContentPortal"
            ]
        }
    }
}
```

The portal extension has to specify which portal it extends and which classes shall be injected into the decoration chain:

```php
class BottlesWithContentPortal extends PortalExtensionContract
{
    public function getEmitterDecorators(): EmitterCollection
    {
        return new EmitterCollection([
            new BottleWithContentEmitter(),
        ]);
    }

    public function supports(): string
    {
        return BottlesLocalPortal::class;
    }
}
```

The emitter decorator will be injected into the call chain and can now alter the mappings to be read from the original and add new data.

```php
class BottleWithContentEmitter extends EmitterContract
{
    protected function extend(
        MappingInterface $mapping,
        DatasetEntityContract $entity,
        EmitContextInterface $context
    ) : ?DatasetEntityContract {
        $portal = $context->getContainer()->get('portal');
        // get portal specific API client to communicate the extra data from the contexts configuration
        $data = $portal->getApiClient($context->getConfig($mapping))
            ->selectContentData($mapping->getExternalId());

        if (\count($data) > 0) {
            // assign extra data to the already emitted entity
            $content = (new BottleContent())
                ->setContent(
                    (new Volume)
                        ->setContent($data['content'])
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
