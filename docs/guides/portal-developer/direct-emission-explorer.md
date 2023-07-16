# Direct Emission Explorer

A portal connects to a data source for read and write operations.
To let HEPTAconnect know about objects in the data source, an [explorer](./explorer.md) has to publish these objects' primary keys.
This can be an issue when data sources are read-once or difficult to navigate to certain data points so emitters can't act on it properly.
To solve this we allow explorers to emit as well.

## Intention

Beside the intentions of a regular [explorer](./explorer.md) this can be used for rather static data or difficult/inefficient to access data sources as this is also allowed to do an [emission](../../reference/general-resources/data-flow.md).

## Usage

Explorers must implement the `ExplorerContract`.
Every explorer must define which data type it supports.
In the following example we see an explorer that supports the data type `Bottle`.

```php
public function supports(): string
{
    return Bottle::class;
}
```

The `run` method iterates over objects in your data source and return them as dataset entities.
It is crucial to set the primary key of these entities.

```php
protected function run(ExploreContextInterface $context): iterable
{
    $credentials = $context->getConfig()['credentials'];
    $client = new ApiClient($credentials);
    
    foreach ($client->getBottles() as $bottle)
    {
        $entity = new Bottle();
        $entity->setPrimaryKey((string) $bottle['id']);
        $entity->setCapacity(new Liter($bottle['volume']));
        
        yield $entity;
    }
}
```

The explorer will iterate over the result of `$client->getBottles()` and construct a data set entity for every item.
The primary key is set and the entity is then yielded and passed into an [emission](../../reference/general-resources/data-flow.md).
