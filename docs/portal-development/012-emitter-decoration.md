# Emitter decoration

|             |       |
| ----------- | ----- |
| Introduced  | 1.0.0 |
| Deprecated  | -     |
| Removed     | -     |
| Replacement | -     |

A portal extension allows further customizations in behaviour.
This includes changing the emission of data on elements. 

## Intention

A decorating emitter can change values of existing scalar values and add further attachments to an entity for further complex data structures to be transferred.

## Usage

Decorating emitters must follow the same basics as normal emitters so be sure to read the [emitter explanation](./003-emitter.md) page first.
The main difference is in their registration.
A portal extension must include each of its emitter decorators in the result of `getEmitterDecorators`.

Implementing `run` in an emitter decorator like a normal emitter will add further elements to the emission process.
This is useful when more entities are explored first otherwise we run into confusion for the further processing as for the same primary key there will be two different filled values emitted.
To prevent duplicate emission you can add a check whether this is the right entity to process and otherwise return `null`.

```php
protected function run(
    MappingInterface $mapping,
    EmitContextInterface $context
): ?DatasetEntityInterface {
    $portal = $context->getContainer()->get('portal');
    // get portal specific API client to communicate the data from the contexts configuration
    $credentials = $context->getConfig($mapping)['credentials'];
    $client = $portal->getClient($credentials);

    if (!$client->isOtherBottle($mapping->getExternalId())) {
        return null;
    }

    $data = $client->select($mapping->getExternalId());

    if (\count($data) === 0) {
        return null;
    }

    return (new Bottle())
        ->setCap((new Cap())->setName($data['cap']))
        ->setCapacity(new Liter($data['volume']));
}
```

The `$portal` should technically always be an instance of the extended portal.
In the example above we call `$portal->getClient(...)`, which is not part of the `PortalContract` but instead a custom public method of the `BottlePortal`.
The emitter will then check if this is an other bottle that has been explored by the explorer decorator first and load it.
Otherwise skip it by returning `null`.

For a scenario to add further data to already emitted elements by the extended portal you have to implement `emit` and `runToExtend`.
`emit` has to be adjusted to not execute the default `run` method but the `runToExtend` instead.

```php
public function emit(
    MappingCollection $mappings,
    EmitContextInterface $context,
    EmitterStackInterface $stack
): iterable {
    return $this->emitNextToExtend($stack, $mappings, $context);
}
```

As long as the `emitNextToExtend` method is used the `runToExtend` method is invoked for each entry the decorated emitter yields to allow further data assignments.
In the following example we add additives we only allow bottles that contain caffeinated beverages.

```php
protected function runToExtend(
    MappingInterface $mapping,
    DatasetEntityContract $entity,
    EmitContextInterface $context
): ?DatasetEntityContract {
    $portal = $context->getContainer()->get('portal');
    $credentials = $context->getConfig($mapping)['credentials'];
    $client = $portal->getClient($credentials);
    
    $entity->attach($client->getBottleAdditives($entity->getPrimaryKey()));
    
    return $entity;
}
```
