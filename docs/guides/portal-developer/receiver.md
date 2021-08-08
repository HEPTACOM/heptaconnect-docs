# Receiver

A receiver is a flow component that has the job to take incoming entities from HEPTAconnect, convert them into API specific structures and write the API payload into its portal's data source.

## Usage

Receivers must implement the `ReceiverContract`.
Every receiver must define which data type it supports.
In the following example we see a receiver that supports the data type `Bottle`.

```php
public function supports(): string
{
    return Bottle::class;
}
```

The `run` method receives a completely filled entity and must set a primary key to the entity after successful writing it to the portal's data source.

```php
protected function run(DatasetEntityContract $entity, ReceiveContextInterface $context): void
{
    $credentials = $context->getConfig()['credentials'];
    $client = new ApiClient($credentials);
    
    if ($entity->getPrimaryKey()) {
        $client->updateBottle($entity->getPrimaryKey(), [
            'capacity' => $entity->getCapactity()->getAmount(),
            'shape' => $entity->getShape()->getType(),
            'labels' => $entity->getLabels()->column('getText'),
        ]);
    } else {
        $id = $client->createBottle([
            'capacity' => $entity->getCapactity()->getAmount(),
            'shape' => $entity->getShape()->getType(),
            'labels' => $entity->getLabels()->column('getText'),
        ]);
        $entity->setPrimaryKey($id);
    }
}
```

To run the process in a batch pattern you can also implement `batch` instead.

```php
protected function batch(TypedDatasetEntityCollection $entities, ReceiveContextInterface $context): void
{
    $commands = $entities->map(static fn (Bottle $b): array => [
        'id' => $b->getPrimaryKey(),
        'capacity' => $entity->getCapactity()->getAmount(),
        'shape' => $entity->getShape()->getType(),
        'labels' => $entity->getLabels()->column('getText'),
    ]);
    
    $credentials = $context->getConfig()['credentials'];
    $client = new ApiClient($credentials);
    $results = $client->upsertBottles($commands);
    
    foreach ($entities as $step => $bottle) {
        $bottle->setPrimaryKey($results[$step]);
    }
}
```
