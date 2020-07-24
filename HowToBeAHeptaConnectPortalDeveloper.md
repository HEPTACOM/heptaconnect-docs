# How to be a HEPTAConnect portal developer

This is all about the guidelines to structure a portal or portal extensions. Be sure to know then general thoughts and requirements to be a [HEPTAConnect developer](./HowToBeAHeptaConnectDeveloper.md) and have a basic understanding what a dataset is and what it means to [develop one](./HowToBeAHeptaConnectDatasetDeveloper.md).

### Composer

It is recommended to add the keyword `heptaconnect-portal` to the composer package that provides one or more portals. This way more people can easily find your portal on packagist. A common `composer.json` for a portal providing package may look like this:

```json
{
    "name": "acme/heptaconnect-portal-bottle",
    "description": "HEPTAConnect portal to provide bottles from bottles.local",
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

### Structure

A portal provides several emitters and receivers to communicate a certain set of dataset entities from an API towards HEPTAConnect and back. In the case of the bottle dataset we need an emitter and receiver to transfer bottle data. The portal class that is referenced in the composer json extra populates every class that shall be part of the HEPTAConnect processes:

```php
class BottlesLocalPortal extends AbstractPortalNode
{
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

    public function getApiClient(array $config): AcmeApiClient;
}
```

A receiver gets data from HEPTAConnect is to be told to communicate towards the API it wraps. A common implementation is to let the portal provide an custom API client and let the receiver do the translation work from dataset structures to API structures:

```php
class BottleReceiver extends AbstractReceiver
{
    public function receive(
        MappedDatasetEntityCollection $mappedDatasetEntities,
        ReceiveContextInterface $context,
        ReceiverStackInterface $stack
    ): iterable {
        // iterate through all entities with a mapping to be transferred
        foreach ($mappedDatasetEntities as $mappedEntity) {
            $mapping = $mappedEntity->getMapping();
            // get the specific portalNode that is targeted
            $portalNode = $context->getPortalNode($mapping);
            
            if (!$portalNode instanceof BottlesLocalPortal) {
                // mark the mapping having an error
                $context->markAsFailed($mapping, new InvalidPortalException());
                continue;
            }

            /* @var Bottle $entity */
            $entity = $mappedEntity->getEntity();
            $id = $mapping->getExternalId() ?? Uuid::uuid4()->toString();

            try {
                // get portal specific API client to communicate the data from the contexts configuration
                $portalNode->getApiClient($context->getConfig($mapping))
                    ->upsert([
                        'id' => $id,
                        'cap' => $entity->getCap()->getType(),
                        'volume' => $entity->getCapacity()->as(Liter::class),
                    ]);
            } catch (\Throwable $t) {
                // mark the mapping having an error
                $context->markAsFailed($mapping, $t);
                continue;
            }
            
            // mark the mapping as successfully transferred and yield the positive result 
            $mapping->setExternalId($id);
            yield $mapping;
        }

        // call any other bottle receiver in the chain
        yield from $stack->next($mappedDatasetEntities, $context);
    }

    public function supports(): array
    {
        // tells HEPTAConnect to use this receiver for bottles only
        return [Bottle::class];
    }
}
``` 

As we just read how a receiver is reduced to the case of communication we can compare it to an emitter that loads data from an API and feeds it into HEPTAConnect.

```php
class BottleEmitter extends AbstractEmitter
{
    public function emit(
        MappingCollection $mappings,
        EmitContextInterface $context,
        EmitterStackInterface $stack
    ): iterable {
        // iterate through all requested mappings to be processed
        foreach ($mappings as $mapping) {
            // get the specific portalNode that is targeted
            $portalNode = $context->getPortalNode($mapping);
            
            if (!$portalNode instanceof BottlesLocalPortal) {
                continue;
            }

            // get portal specific API client to communicate the data from the contexts configuration
            $data = $portalNode->getApiClient($context->getConfig($mapping))
                ->select($mapping->getExternalId());

            if (\count($data) === 0) {
                continue;
            }           

            // yield the read data and connect it to the mapping
            yield new MappedDatasetEntityStruct(
                $mapping,
                (new Bottle())
                    ->setCap(
                        (new Cap())
                            ->setName($data['cap'])
                    )
                    ->setCapacity(new Liter($data['volumne']))
            );
        }

        // call any other bottle emitter in the chain
        yield from $stack->next($mappings, $context);
    }

    public function supports(): array
    {
        // tells HEPTAConnect to use this emitter for bottles only
        return [Bottle::class];
    }
}
```

### Extend portals via attachments

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
class BottlesWithContentPortal extends AbstractPortalNodeExtension
{
    public function getEmitterDecorators(): EmitterCollection;
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
class BottleWithContentEmitter extends AbstractEmitter
{
    public function emit(
        MappingCollection $mappings,
        EmitContextInterface $context,
        EmitterStackInterface $stack
    ): iterable {
        // iterate through all requested mappings to be processed
        foreach ($stack->next($mappings, $context) as $mappedEntity) {
            // get the specific portalNode that is targeted
            $portalNode = $context->getPortalNode($mappedEntity->getMapping());
            
            if (!$portalNode instanceof BottlesLocalPortal) {
                continue;
            }

            // get portal specific API client to communicate the extra data from the contexts configuration
            $data = $portalNode->getApiClient($context->getConfig($mappedEntity->getMapping()))
                ->selectContentData($mappedEntity-getMapping()->getExternalId());

            if (\count($data) > 0) {
                // assign extra data to the already emitted entity
                $content = (new BottleContent())
                    ->setContent(
                        (new Volume)
                            ->setContent($data['content'])
                            ->setUnit(Volume::UNIT_LITER)
                    );
                $mappedEntity->getDatasetEntity()->attach($content);
            }

            yield $mappedEntity;
        }
    }

    public function supports(): array
    {
        // tells HEPTAConnect to use this emitter for bottles only
        return [Bottle::class];
    }
}
```
