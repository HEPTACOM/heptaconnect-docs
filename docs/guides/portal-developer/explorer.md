# Explorer

|             |       |
| ----------- | ----- |
| Introduced  | 1.0.0 |
| Deprecated  | -     |
| Removed     | -     |
| Replacement | -     |

A portal connects to a data source for read and write operations.
To let HEPTAconnect know about objects in the data source, an explorer has to publish these objects' primary keys.
Publishing a primary key means to check whether a mapping for it already exists and to create one if it doesn't.

## Intention

An explorer is a flow component that is primarily used after a new portal node has been created.
At this moment there are no mappings in HEPTAconnect (for that portal node) but objects are already present in the data source.
To get all these objects into the system, an explorer iterates over all of their identifiers and publishes them.

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

The `run` method iterates over primary keys in your data source and yield them.

```php
protected function run(ExploreContextInterface $context): iterable
{
    $credentials = $context->getConfig()['credentials'];
    $client = new ApiClient($credentials);
    
    yield from $client->getBottleIds();
}
```

The explorer will iterate over the result of `$client->getBottleIds()` and yield the ids.
