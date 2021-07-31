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

Decorating emitters must follow the same basics as normal emitters so be sure to read the [emitter explanation](./emitter.md) page first.

Implementing `run` in an emitter decorator like a normal emitter will add further elements to the emission process.
This is useful when more entities are explored first otherwise we run into confusion for the further processing as for the same primary key there will be two different filled values emitted.
To prevent duplicate emission you can add a check whether this is the right entity to process and otherwise return `null`.

```php
protected function run(string $externalId, EmitContextInterface $context): ?DatasetEntityContract
{
    // get portal specific API client to communicate the data from the contexts configuration
    $credentials = $context->getConfig()['credentials'];
    $client = new ApiClient($credentials);

    if (!$client->isOtherBottle($externalId)) {
        return null;
    }

    $data = $client->select($externalId);

    if (\count($data) === 0) {
        return null;
    }

    return (new Bottle())
        ->setCap((new Cap())->setName($data['cap']))
        ->setCapacity(new Liter($data['volume']));
}
```

The emitter will check if this is an other bottle that has been explored by the explorer decorator first and load it.
Otherwise skip it by returning `null`.

---

For a scenario to add further data to already emitted elements by the extended portal you have to implement `extend` instead of `run`.
In the following example we add additives to the previously emitted bottle.

```php
protected function extend(DatasetEntityContract $entity, EmitContextInterface $context): ?DatasetEntityContract
{
    $credentials = $context->getConfig()['credentials'];
    $client = new ApiClient($credentials);
    
    $entity->attach($client->getBottleAdditives($entity->getPrimaryKey()));
    
    return $entity;
}
```
