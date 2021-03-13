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
A portal extension must include each of its explorer decorators in the result of `getExplorerDecorators`.

Implementing `run` in an explorer decorator like this will add further elements to the exploration process.

```php
protected function run(ExploreContextInterface $context): iterable
{
    $portal = $context->getPortal();
    $credentials = $context->getConfig()['credentials'];
    $client = $portal->getClient($credentials);
    
    foreach ($client->getOtherBottles() as $bottle)
    {
        $entity = new Bottle();
        $entity->setPrimaryKey((string) $bottle['id']);
        
        yield $entity;
    }
}
```

The `$portal` should technically always be an instance of the extended portal.
In the example above we call `$portal->getClient(...)`, which is not part of the `PortalContract` but instead a custom public method of the `BottlePortal`.
The explorer will then iterate over the result of `$client->getOtherBottles()` and construct a data set entity for every item.
The primary key is set and the entity is then yielded.

For a scenario to skip elements that should not be discovered anymore by the extended portal you have to implement `explore` and `isAllowed`.
`explore` has to be adjusted to not execute the default `run` method but the allowance check instead.

```php
public function explore(ExploreContextInterface $context, ExplorerStackInterface $stack): iterable
{
    return $this->exploreNextIfAllowed($context, $stack);
}
```

As long as the `exploreNextIfAllowed` method is used the `isAllowed` method is invoked for each entry the decorated explorer yields to allow further checks.
In the following example we only allow bottles that contain caffeinated beverages.

```php
protected function isAllowed(DatasetEntityContract $entity, ExploreContextInterface $context): bool
{
    $portal = $context->getPortal();
    $credentials = $context->getConfig()['credentials'];
    $client = $portal->getClient($credentials);
    
    return $client->getBottleAdditives($entity->getPrimaryKey())->contains('caffeine');
}
```
