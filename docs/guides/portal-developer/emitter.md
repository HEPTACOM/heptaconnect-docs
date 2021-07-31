# Emitter

An emitter is a flow component that has the job to read data from its portal's data source, convert it into a data set entity and hand that entity over to HEPTAconnect.

## Intention

When an object from a data source is published to HEPTAconnect, a mapping will be created (if it doesn't exist yet).
A publication also sends a message to the job queue telling HEPTAconnect to emit the object.
This approach has the benefit (as opposed to direct transfer) that publications can be done quickly and don't take up a lot of computing time.
This enables publications during time critical processes like e.g. a web request.

The actual reading of data is handled by a consumer process of the job queue, while the publication can have various origins.

## Usage

Emitters must implement the `EmitterContract`.
Every emitter must define which data type it supports.
In the following example we see an emitter that supports the data type `Bottle`.

```php
public function supports(): string
{
    return Bottle::class;
}
```

The `run` method receives a single id and should return a completely filled entity.

```php
protected function run(string $externalId, EmitContextInterface $context): ?DatasetEntityContract
{
    $credentials = $context->getConfig()['credentials'];
    $client = new ApiClient($credentials);
    
    $result = new Bottle();
    $result->setPrimaryKey($externalId);
    $result->setCapacity($client->readBottleCapacity($externalId));
    $result->setShape($client->readBottleShape($externalId));
    $result->getLabels()->push($client->readBottleLabels($externalId));
    
    return $result;
}
```

To run the process in a batch pattern you can also implement `batch` instead.

```php
protected function batch(iterable $externalIds, EmitContextInterface $context): iterable
{
    $credentials = $context->getConfig()['credentials'];
    $client = new ApiClient($credentials);
    
    $capacities = $client->readBottlesCapacity($externalIds);
    $shapes = $client->readBottlesShape($externalIds);
    $labels = $client->readBottlesLabels($externalIds);
    
    foreach ($externalIds as $externalId) {
        $result = new Bottle();
        $result->setPrimaryKey($externalId);
        $result->setCapacity($capacities[$externalId]);
        $result->setShape($shapes[$externalId]);
        $result->getLabels()->push($labels[$externalId]);
        
        yield $result;
    }
}
```
