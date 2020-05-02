# Receiver

A `Portal` can come with several `Receivers` for different data types. These `Receivers` should choose, which data types they support and then implement writing of certain entities. HEPTAConnect will call the `receive` method with a collection of `MappedDatasetEntities` that the `Receiver` should dehydrate and write to the endpoint or data storage of the `PortalNode`. In most cases, the `Receiver` will use the `PortalNode` to get access to an API or a data storage to write the passed data.

### Interface

```php
interface ReceiverInterface
{
    public function receive(MappedDatasetEntityCollection $mappedDatasetEntities): void;

    public function supports(): array;
}
```

### Example Implementation

```php
class OrderReceiver implements ReceiverInterface
{
    private PortalNodeServiceInterface $portalNodeService;

    private MappingServiceInterface $mappingService;

    public function __construct(
        PortalNodeServiceInterface $portalNodeService,
        MappingServiceInterface $mappingService
    ) {
        $this->portalNodeService = $portalNodeService;
        $this->mappingService = $mappingService;
    }

    public function receive(MappedDatasetEntityCollection $mappedDatasetEntities): void
    {
        foreach ($mappedDatasetEntities as $mappedDatasetEntity) {
            $entity = $mappedDatasetEntity->getEntity();
            $mapping = $mappedDatasetEntity->getMapping();

            $portalNode = $this->portalNodeService->get(
                $mapping->getPortalNodeId()
            );

            if (!$portalNode instanceof ExamplePortal) {
                continue;
            }

            $externalId = $portalNode->writeOrder($entity);
            $mapping->setExternalId($externalId);

            $this->mappingService->update($mapping);
        }
    }

    public function supports(): array
    {
        return [
            Order::class,
        ];
    }
}
```
