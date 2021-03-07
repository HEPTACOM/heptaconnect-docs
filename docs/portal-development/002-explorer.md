# Explorer

|             |       |
| ----------- | ----- |
| Introduced  | 1.0.0 |
| Deprecated  | -     |
| Removed     | -     |
| Replacement | -     |

A portal connects to a data source for read and write operations. To let HEPTAconnect know about objects in the data source, an explorer has to publish these objects. Publishing an object means to check whether a mapping for it already exists and to create one if it doesn't. 

## Intention

An explorer is primarily used after a new portal node has been created. At this moment there are no mappings in HEPTAconnect (for that portal node) but objects are already present in the data source. To get all these objects into the system, an explorer iterates over all of them and publishes them.

## Usage

Explorers must implement the `ExplorerContract`. A portal must include each of its explorers in the result of `getExplorers`. Every explorer must define which data type it supports. In the following example we see an explorer that supports the data type `Bottle`.

```php
public function supports(): string
{
    return Bottle::class;
}
```

The `run` method is used to iterate over objects in your data source and return them as data set entities. It is crucial to set the primary key of these entities. Everything else will be ignored.

```php
protected function run(ExploreContextInterface $context): iterable
{
    $portal = $context->getPortal();
    $credentials = $context->getConfig()['credentials'];
    $client = $portal->getClient($credentials);
    
    foreach ($client->getBottles() as $bottle)
    {
        $entity = new Bottle();
        $entity->setPrimaryKey((string) $bottle['id']);
        
        yield $entity;
    }
}
```

The `$portal` should technically always be an instance of your portal. But for type safety you should always include the `instanceof` check and throw an `UnexpectedPortalNodeException` if there is a type mismatch. This allows your explorer to call custom public methods of your portal. In the example above we call `$portal->getClient(...)`, which is not part of the `PortalContract` but instead a custom public method of the `BottlePortal`. The explorer will then iterate over the result of `$client->getBottles()` and construct a data set entity for every item. The primary key is set and the entity is then yielded.
