# Receiver decoration

A portal extension allows further customizations in behaviour.
This includes adding further writes when receiving data from elements.

## Intention

A decorating receiver can:
* change values of existing scalar values and add further attachments to an entity for further complex data structures to be received by the decorated receiver
* replace the complete receive process of the decorated receiver
* use the received and mapped entities of the decorated receiver and do further actions on them

## Usage

Decorating receiver must follow the same basics as normal receivers so be sure to read the [receiver explanation](./receiver.md) page first.

Implementing `run` in a receiver decorator like a normal receiver will receive first all elements before the decorated receiver.

For a scenario to read further data to already received elements by the extended receiver you have to implement `receive` and `run`.
`receive` has to be adjusted to not execute the `run` method with data before the decorated receiver but after the decorated receiver has run.

```php
public function receive(
    MappedDatasetEntityCollection $mappedDatasetEntities,
    ReceiveContextInterface $context,
    ReceiverStackInterface $stack
): iterable {
    return $this->receiveNextForExtends($stack, $mappedDatasetEntities, $context);
}

/**
 * @param Bottle $entity  
 */
protected function run(DatasetEntityContract $entity, ReceiveContextInterface $context): void
{
    if ($entity->getPrimaryKey() === null) {
        return;
    }
    
    $additives = $entity->getAttachment(AdditiveCollection::class);
    
    if (!$additives instanceof AdditiveCollection) {
        return;
    }

    $credentials = $context->getConfig()['credentials'];
    $client = new ApiClient($credentials);
    // get portal specific API client to communicate the data from the contexts configuration
    $client->upsert(
        $additives->map(static fn (Additive $a): array => [        
            'additiveName' => $a->getName(),
            'bottleId' => $entity->getPrimaryKey(),
        ])
    );
}
```

The receiver will check if this entity has been received by the receiver decorator first and save additional data.
