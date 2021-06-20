# Explorer decoration

|             |       |
| ----------- | ----- |
| Introduced  | 1.0.0 |
| Deprecated  | -     |
| Removed     | -     |
| Replacement | -     |

A portal extension allows further customizations in behaviour.
This includes changing the discovery of elements.

## Intention

A decorating explorer can list additional entries and skip unwanted entries.

## Usage

Decorating explorers must follow the same basics as normal explorers so be sure to read the [explorer explanation](./002-explorer.md) page first.
The main difference is in their registration.

Implementing `run` in an explorer decorator like this will add further elements to the exploration process.

```php
protected function run(ExploreContextInterface $context): iterable
{
    $credentials = $context->getConfig()['credentials'];
    $client = new ApiClient($credentials);
    
    foreach ($client->getOtherBottles() as $bottle)
    {
        $entity = new Bottle();
        $entity->setPrimaryKey((string) $bottle['id']);
        
        yield $entity;
    }
}
```

The explorer will iterate over the result of `$client->getOtherBottles()` and construct a data set entity for every item.
The primary key is set and the entity is then yielded.

For a scenario to skip elements that should not be discovered anymore by the extended portal you have to implement `isAllowed` instead of `run`.
Any explored item will be passed to the allowance check through every decorator.
In the following example we only allow bottles that contain caffeinated beverages.

```php
protected function isAllowed(string $externalId, ?DatasetEntityContract $entity, ExploreContextInterface $context): bool
{
    $credentials = $context->getConfig()['credentials'];
    $client = new ApiClient($credentials);
    
    return $client->getBottleAdditives($externalId)->contains('caffeine');
}
```
