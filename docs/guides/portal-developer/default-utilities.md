# List of default utility services

You can use [dependency injection](./dependency-injection.md) to get access to various services.
This is a list with brief descriptions for every default service available in the container.

## PSR

### ClientInterface

> Psr\Http\Client\ClientInterface

A [PSR-18](https://www.php-fig.org/psr/psr-18/) HTTP client whose implementation is based upon the choice of the bridge.
Reliable service to do HTTP requests with.


### RequestFactoryInterface

> Psr\Http\Message\RequestFactoryInterface

A [PSR-17](https://www.php-fig.org/psr/psr-17/) compliant factory that builds [PSR-7](https://www.php-fig.org/psr/psr-7/) HTTP requests for the `Psr\Http\Client\ClientInterface` service.


### UriFactoryInterface

> Psr\Http\Message\UriFactoryInterface

A [PSR-17](https://www.php-fig.org/psr/psr-17/) compliant factory that builds [PSR-7](https://www.php-fig.org/psr/psr-7/) URIs for the `Psr\Http\Message\RequestFactoryInterface` service.


### LoggerInterface

> Psr\Log\LoggerInterface

A [PSR-3](https://www.php-fig.org/psr/psr-3/) compliant logging service that logs your messages accordingly to your runtime setup.


## HEPTAconnect portal utilities

### NormalizationRegistryContract

> Heptacom\HeptaConnect\Portal\Base\Serialization\Contract\NormalizationRegistryContract

Service to allow different normalization strategies.
Useful to serialize objects and streams.


### DeepCloneContract

> Heptacom\HeptaConnect\Portal\Base\Support\Contract\DeepCloneContract

Service to clone objects.


### DeepObjectIteratorContract

> Heptacom\HeptaConnect\Portal\Base\Support\Contract\DeepObjectIteratorContract

Service to iterate objects like trees.


### ProfilerContract

> Heptacom\HeptaConnect\Portal\Base\Profiling\ProfilerContract

Service to access the profiling component to provide further detailed profiling info.


### PublisherInterface

> Heptacom\HeptaConnect\Portal\Base\Publication\Contract\PublisherInterface

A service to inform HEPTAconnect about the existence of entities.
A publication will trigger an emission of an entity via an event driven flow.


### DirectEmissionFlowContract

> Heptacom\HeptaConnect\Portal\Base\Flow\DirectEmission\DirectEmissionFlowContract

A service to directly emit entities.
This will skip the source emitter in a regular emission stack while the decorators will still be executed.


### Psr7MessageRawHttpFormatterContract

> Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\Psr7MessageRawHttpFormatterContract

Aliased as

> Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\Psr7MessageFormatterContract

A service to format a PSR-7 HTTP message into a file format, that is similar to HTTP raw communication.
It can be used to replay recorded requests using `nc` (netcat), `telnet` and with IDEs by Microsoft and JetBrains.
See its usage in [this pattern](./patterns/http-client-middleware-dumping-on-bad-request.md).


### Psr7MessageCurlShellFormatterContract

> Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\Psr7MessageCurlShellFormatterContract

A service to format a PSR-7 HTTP message into a shell script, that executes `curl` to send the request.
It can be used to replay recorded requests by executing the script.


## HEPTAconnect portal node stack specific services

### PortalContract

> Heptacom\HeptaConnect\Portal\Base\Portal\Contract\PortalContract

The current portal instance.
It is also aliased with the real class so it works with auto-wiring.


### PortalExtensionCollection

> Heptacom\HeptaConnect\Portal\Base\Portal\PortalExtensionCollection

The list of active portal extensions within this container.


### PortalNodeKeyInterface

> Heptacom\HeptaConnect\Portal\Base\StorageKey\Contract\PortalNodeKeyInterface

The portal's portal node key instance.
This can be used with multiple HEPTAconnect services and is a dependency for the following services.


### PortalStorageInterface

> Heptacom\HeptaConnect\Portal\Base\Portal\Contract\PortalStorageInterface

A service to store data in a key-value manner.
Supports time-to-live attributes on entries to allow caching functionality.


### ResourceLockFacade 

> Heptacom\HeptaConnect\Portal\Base\Parallelization\Support\ResourceLockFacade 

A service that allows resource locking functionality to better interrupt between parallel steps.


### HttpClientContract

> Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\HttpClientContract

A [PSR-18](https://www.php-fig.org/psr/psr-18/) based HTTP client with configuration around the original [PSR-18 HTTP client](#clientinterface).
It supports following redirects, header modifications, status code based exceptions, retries on errors and response information.
See reference [here](../../reference/portal-developer/service/http-client-contract.md).


### HttpHandlerUrlProviderInterface

> Heptacom\HeptaConnect\Portal\Base\Web\Http\HttpHandlerUrlProviderInterface

A service that resolves HTTP handler path names into absolute URLs.


### FileReferenceFactoryContract

> Heptacom\HeptaConnect\Portal\Base\File\FileReferenceFactoryContract

A service that stores HTTP requests to get files, raw content of a file and public URLs to files into a file reference to process for a receiving portal.
See usage [here](patterns/transfer-file-reference-by-public-url.md).


### FileReferenceResolverContract

> Heptacom\HeptaConnect\Portal\Base\File\FileReferenceResolverContract

A service that resolves a file reference created by [`Heptacom\HeptaConnect\Portal\Base\File\FileReferenceFactoryContract`](#filereferencefactorycontract) into an accessor to the underlying referenced file content or a public URL to access this file content.
See usage [here](patterns/transfer-file-reference-by-public-url.md).


### FilesystemInterface

> Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface

A service, that provides methods to convert paths and URIs into each other.
The URIs point to the provided portal node file system and **MUST** be used to access the file system, when these files are considered transaction data.
See reference [here](../../reference/portal-developer/service/filesystem-interface.md).
