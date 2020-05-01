# Emitter

A `Portal` can come with several `Emitters` for different data types. These `Emitters` should choose, which data types they support and then implement reading of certain entities. HEPTAConnect will call the `emit` method with a collection of `Mappings` that the `Emitter` should read, hydrate and pass to the `Courier`. In most cases, the `Emitter` will use the `PortalNode` to get access to an API or a data storage to read the requested data.

### Interface

```php
interface EmitterInterface
{
    public function emit(MappingCollection $mappings): void;

    public function supports(): array;
}
```

### Example Implementation

```php
class OrderEmitter implements EmitterInterface
{
    private PortalNodeServiceInterface $portalNodeService;

    private CourierInterface $courier;

    public function __construct(
        PortalNodeServiceInterface $portalNodeService,
        CourierInterface $courier
    ) {
        $this->portalNodeService = $portalNodeService;
        $this->courier = $courier;
    }

    public function emit(MappingCollection $mappings): void
    {
        foreach ($mappings as $mapping) {
            $portalNode = $this->portalNodeService->get(
                $mapping->getPortalNodeId()
            );

            if (!$portalNode instanceof ExamplePortal) {
                continue;
            }

            $entity = $portalNode->readOrder($mapping->getExternalId());

            $this->courier->dispatch(
                $entity,
                $mapping->getPortalNodeId()
            );
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
