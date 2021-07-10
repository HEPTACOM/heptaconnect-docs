# Dependency injection

## Preamble

As commonly used in the PHP community we provide a dependency injection system that allows easy reuse of utilities and services.
We decided to use the Symfony dependency injection package.
Read more in [the ADR section](../adr/2021-04-13-portal-dependency-injection-implementation.md) about our thoughts for our decisions.
The following sections require you to know basic knowledge about the Symfony package which are documented very well [here](https://symfony.com/doc/current/components/dependency_injection.html).


## Zero-configuration setup

Every service container is using a zero-configuration to allow a seamless entry into portal development.
This means auto-configuration, auto-wiring, auto-binding and automatic PSR-4 resource loading is active by default.
These features enable dependency injection without any setup steps for the developer.


## How to get a service?

There are multiple utility services available for every portal node service container.
Checkout the [next page](./016-default-utilities.md) for a complete overview of all utility services.
The examples in this section work with the [PSR-3](https://www.php-fig.org/psr/psr-3/) `LoggerInterface`.


### Auto-wiring

The following small status reporter implementation shows how to get an instance of a logger into the status reporter by auto-wiring:

```php
namespace FooBar\StatusReporter;

use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReporterContract;
use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReportingContextInterface;
use Psr\Log\LoggerInterface;

class HealthStatusReporter extends StatusReporterContract
{
    private LoggerInterface $logger;
    
    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function supportsTopic(): string
    {
        return self::TOPIC_HEALTH;
    }

    protected function run(StatusReportingContextInterface $context): array
    {
        $this->logger->warning('The status reporter has been called.');    

        return [$this->supportsTopic() => true];
    }
}
```

Auto-wiring detected the `\Psr\Log\LoggerInterface` in the constructor and automatically decided to go for the logger implementation that is already available for every portal node.


### Auto-configuration

The following small status reporter implementation shows how to get an instance of a logger into the status reporter by auto-configuration:

```php
namespace FooBar\StatusReporter;

use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReporterContract;
use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReportingContextInterface;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerAwareTrait;

class HealthStatusReporter extends StatusReporterContract implements LoggerAwareInterface
{
    use LoggerAwareTrait;

    public function supportsTopic(): string
    {
        return self::TOPIC_HEALTH;
    }

    protected function run(StatusReportingContextInterface $context): array
    {
        $this->logger->warning('The status reporter has been called.');    

        return [$this->supportsTopic() => true];
    }
}
```

There is an auto-configuration rule for the `\Psr\Log\LoggerAwareInterface` interface which will later call the `setLogger` method on the instance of this class.
In the snippet above there is no visible `setLogger` implementation.
The missing implementation is covered by the `\Psr\Log\LoggerAwareTrait`.
Eventually it is a similar way to the constructor as the logger is set right after the constructor has been called.


### Auto-binding

The following is an example about accessing files.
For this scenario an instance of `\League\Flysystem\FilesystemInterface` is needed to access the files of the portal node and a configuration entry for the filename to be read from.

At first the portal definition states the `filename` as configuration:

```php
namespace FooBar;

use Heptacom\HeptaConnect\Portal\Base\Portal\Contract\PortalContract;
use Symfony\Component\OptionsResolver\OptionsResolver;

class Portal extends PortalContract
{
    public function getConfigurationTemplate() : OptionsResolver
    {
        return parent::getConfigurationTemplate()
            ->setDefault('filename', 'foobar.json')
            ->setAllowedTypes('filename', 'string');
    }
}
```

The next snippet shows a service that will act as a centralized component to access the underlying data source; a JSON file:

```php
namespace FooBar\Service;

use League\Flysystem\FilesystemInterface;

class File
{
    private FilesystemInterface $filesystem;
    
    private string $configFilename;
    
    public function __construct(FilesystemInterface $filesystem, string $configFilename)
    {
        $this->filesystem = $filesystem;
        $this->configFilename = $configFilename;
    }
    
    public function readAll(): array
    {
        return (array) \json_decode($this->filesystem->read($this->configFilename) ?: '[]');
    }
}
```

This service uses auto-binding to read the values from the portal node configuration and inject it as variable into the service.
The variable naming follows the pattern to add `config` as prefix and the configuration name in camelCase.


### Service container

Any flow component context allows you direct access to the [PSR-11](https://www.php-fig.org/psr/psr-11/) service container.

```php
namespace FooBar\StatusReporter;

use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReporterContract;
use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReportingContextInterface;
use Psr\Log\LoggerInterface;

class HealthStatusReporter extends StatusReporterContract
{
    public function supportsTopic(): string
    {
        return self::TOPIC_HEALTH;
    }

    protected function run(StatusReportingContextInterface $context): array
    {
        if ($context->getContainer()->has(LoggerInterface::class)) {        
            $logger = $context->getContainer()->get(LoggerInterface::class);

            $logger->warning('The status reporter has been called.');    
        }

        return [$this->supportsTopic() => true];
    }
}
```

Add special attention to the implementation as it uses a `has` check before the service is acquired.
This way you can have a running flow component as it adds the existence check of the service and still stays in a zero-configuration code setup.
Be aware that this hides the dependency onto the logger service within the implementation of the class above.


## Define custom services

### Zero-configuration

The portal node containers make use of the [PSR-4](https://www.php-fig.org/psr/psr-4/) definitions within the [composer.json](https://getcomposer.org/doc/04-schema.md#psr-4) of the portal and portal extensions.
That way any class within the referenced folders are automatically available as services:

```
<portal-dir>
├── composer.json
└── src
    ├── AcmeApi
    │   └── ApiClient.php
    ├── StatusReporter
    │   └── HealthStatusReporter.php
    └── Portal.php
```

The portal now has three services available:

* `FooBar\Portal`
* `FooBar\AcmeApi\ApiClient`
* `FooBar\StatusReporter\HealthStatusReporter`

Auto-wiring can now automatically inject an `ApiClient` instance into the `HealthStatusReporter`.

```php
namespace FooBar\AcmeApi;

class ApiClient
{
    public function ping(): bool
    {
        return true;
    }
}
```

```php
namespace FooBar\StatusReporter;

use FooBar\AcmeApi\ApiClient;
use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReporterContract;
use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReportingContextInterface;

class HealthStatusReporter extends StatusReporterContract
{
    private ApiClient $client;
    
    public function __construct(ApiClient $client)
    {
        $this->client = $client;
    }

    public function supportsTopic(): string
    {
        return self::TOPIC_HEALTH;
    }

    protected function run(StatusReportingContextInterface $context): array
    {
        return [$this->supportsTopic() => $this->client->ping()];
    }
}
```

### Service argument aliases

A common pattern is to have repositories for each API resources.
In the following scenario they all share the same interface `ApiResourceInterface`.
When you have multiple services with the same interface, auto-wiring can't decide properly which service is the right one.
In these situations it is handy to use argument aliases, so the argument names can help out.
This is the very first moment you need a custom service container definition.

To load your service definition file it must be named `services.{xml,yml,yaml,php}` and it must be located inside the directory `src/Resources/config`.

The file structure should look similar to this:

```
<portal-dir>
├── composer.json
└── src
    ├── AcmeApi
    │   ├── ApiClient.php
    │   └── ApiResourceInterface.php
    │   ├── AppleRepository.php
    │   └── OrangeRepository.php
    ├── Resources
    │   └── config
    │       └── services.xml
    ├── StatusReporter
    │   └── HealthStatusReporter.php
    └── Portal.php
```

The two repositories look quite similar and are interchangeable with each other.

```php
namespace FooBar\AcmeApi;

class AppleRepository implements ApiResourceInterface
{
    private ApiClient $client;

    public function __construct(ApiClient $client)
    {
        $this->client = $client;
    }

    public function findAll(): array
    {
        return $this->client->findAll('apple');
    }
}
```

```php
namespace FooBar\AcmeApi;

class OrangeRepository implements ApiResourceInterface
{
    private ApiClient $client;

    public function __construct(ApiClient $client)
    {
        $this->client = $client;
    }

    public function findAll(): array
    {
        return $this->client->findAll('orange');
    }
}
```

Now the `HealthStatusReporter` requires both repositories and will render the auto-wiring invalid:

```php
namespace FooBar\StatusReporter;

use FooBar\AcmeApi\ApiClient;
use FooBar\AcmeApi\ApiResourceInterface;
use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReporterContract;
use Heptacom\HeptaConnect\Portal\Base\StatusReporting\Contract\StatusReportingContextInterface;

class HealthStatusReporter extends StatusReporterContract
{
    private ApiClient $client;

    private ApiResourceInterface $apples;
    
    private ApiResourceInterface $oranges;

    public function __construct(ApiClient $client, ApiResourceInterface $apples, ApiResourceInterface $oranges)
    {
        $this->client = $client;
        $this->apples = $apples;
        $this->oranges = $oranges;
    }

    public function supportsTopic(): string
    {
        return self::TOPIC_HEALTH;
    }

    protected function run(StatusReportingContextInterface $context): array
    {
        return [
            $this->supportsTopic() => $this->client->ping(),
            'apple-count' => count($this->apples->findAll()),
            'orange-count' => count($this->oranges->findAll()),
        ];
    }
}
```

Having the following service definition it is possible to determine the difference for both services.

```xml
<?xml version="1.0"?>
<container
    xmlns="http://symfony.com/schema/dic/services"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd"
>
    <services>
        <service alias="AcmeApi\AppleRepository" id="FooBar\AcmeApi\ApiResourceInterface $apples"/>
        <service alias="AcmeApi\OrangeRepository" id="FooBar\AcmeApi\ApiResourceInterface $oranges"/>
    </services>
</container>
```
