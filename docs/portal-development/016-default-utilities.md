# List of default utility services

## PSR

### Psr\Http\Client\ClientInterface

A [PSR-18](https://www.php-fig.org/psr/psr-18/) HTTP client whose implementation is based upon the choice of the bridge.
Reliable service to do HTTP requests with.


### Psr\Http\Message\RequestFactoryInterface

A [PSR-17](https://www.php-fig.org/psr/psr-17/) compliant factory that builds [PSR-7](https://www.php-fig.org/psr/psr-7/) HTTP requests for the `Psr\Http\Client\ClientInterface` service. 


### Psr\Http\Message\UriFactoryInterface

A [PSR-17](https://www.php-fig.org/psr/psr-17/) compliant factory that builds [PSR-7](https://www.php-fig.org/psr/psr-7/) URIs for the `Psr\Http\Message\RequestFactoryInterface` service. 


### Psr\Log\LoggerInterface

A [PSR-3](https://www.php-fig.org/psr/psr-3/) compliant logging service that logs your messages accordingly to your runtime setup.


## HEPTAconnect portal node stack specific services

### Heptacom\HeptaConnect\Portal\Base\Portal\Contract\PortalContract

The current portal instance.
It is also aliased with the real class so it works with auto-wiring.


### Heptacom\HeptaConnect\Portal\Base\Portal\PortalExtensionCollection

The list of active portal extensions within this container.


### Heptacom\HeptaConnect\Portal\Base\StatusReporting\StatusReporterCollection

The complete list of status reporters that are active within this portal node.


### Heptacom\HeptaConnect\Portal\Base\Emission\EmitterCollection

The complete list of emitters that are active within this portal node.


### Heptacom\HeptaConnect\Portal\Base\Emission\EmitterCollection.decorator

The complete list of emitter decorators that are active within this portal node.


### Heptacom\HeptaConnect\Portal\Base\Exploration\ExplorerCollection

The complete list of explorers that are active within this portal node.


### Heptacom\HeptaConnect\Portal\Base\Exploration\ExplorerCollection.decorator

The complete list of explorer decorators that are active within this portal node.


### Heptacom\HeptaConnect\Portal\Base\Reception\ReceiverCollection

The complete list of receivers that are active within this portal node.


### Heptacom\HeptaConnect\Portal\Base\Reception\ReceiverCollection.decorator

The complete list of receiver decorators that are active within this portal node.


### Heptacom\HeptaConnect\Portal\Base\StorageKey\Contract\PortalNodeKeyInterface

The portal's portal node key instance.
This can be used with multiple HEPTAconnect services and is a dependency for the following services.


### Heptacom\HeptaConnect\Portal\Base\Portal\Contract\PortalStorageInterface

A service to store data in a key-value manner.
Supports time-to-live attributes on entries to allow caching functionality.


### Heptacom\HeptaConnect\Portal\Base\Parallelization\Support\ResourceLockFacade 

A service that allows resource locking functionality to better interrupt between parallel steps.


## HEPTAconnect portal utilities

### Heptacom\HeptaConnect\Portal\Base\Serialization\Contract\NormalizationRegistryContract

Service to allow different normalization strategies.
Useful to serialize objects and streams.


### Heptacom\HeptaConnect\Portal\Base\Support\Contract\DeepCloneContract

Service to clone objects.


### Heptacom\HeptaConnect\Portal\Base\Support\Contract\DeepObjectIteratorContract

Service to iterate objects like trees.


### Heptacom\HeptaConnect\Portal\Base\Profiling\ProfilerContract

Service to access the profiling component to provide further detailed profiling info.
