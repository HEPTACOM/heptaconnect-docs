# Status Reporting

|             |       |
| ----------- | ----- |
| Introduced  | 1.0.0 |
| Deprecated  | -     |
| Removed     | -     |
| Replacement | -     |

Status reporting provides JSON serializable data, so it can be processed easily by many services. It is divided into multiple topics. There are four core topics to define a common set that probably every portal needs:

* **health** Provide hints about I/O connectivity
* **config** Provide hints about configuration choices
* **analysis** Provide hints about usage statistics
* **info** Provide static data that does not fit into a composer package structure

Any portal and portal extension provides status reporters for any topic they want to.

## Intention

Status reporters are intended for the usage of the four core reportings. It is fine to add new topics, but some tooling might not support it out of the box.

This way a portal can communicate how to configure a portal node in a multi-step configuration setup or inform about the health status of the connected datasource for monitoring in everyday usage.

## Usage

To register a status reporter a portal they implement the method `getStatusReporters` and return all the status reporter instances they provide.

### Health

A health status reporter can look like this:

```php
class HealthStatusReporter extends StatusReporterContract
{
    public function supportsTopic(): string
    {
        return self::TOPIC_HEALTH;
    }

    /**
     * @param Portal $portal
     */
    protected function run(PortalContract $portal, StatusReportingContextInterface $context): array
    {
        $result = [$this->supportsTopic() => true];

        try {
            $portal->getApiClient($context->getConfig())->commonReadonlyEndpoint();
        } catch (\Throwable $exception) {
            $result[$this->supportsTopic()] = false;
            $result['message'] = $exception->getMessage();
        }

        return $result;
    }
}
```

This status reporter uses the topic key to communicate the evaluation of the portal node topics' well-being. It also uses a common endpoint on the data source to validate the configuration is usable in a production scenario and therefore validates the health state of the underlying API of the datasource.

### Configuration

A configuration status reporter can look like this:

```php
class ConfigurationStatusReporter extends StatusReporterContract
{
    public function supportsTopic(): string
    {
        return self::TOPIC_CONFIG;
    }

    /**
     * @param Portal $portal
     */
    protected function run(PortalContract $portal, StatusReportingContextInterface $context): array
    {
        $result = [$this->supportsTopic() => true];

        try {
            $nodes = $portal->getApiClient($context->getConfig())->getSubnodes();
            $result['nodes'] = array_map(fn (Node $node) => $node->getId(), $nodes);
        } catch (\Throwable $exception) {
            $result[$this->supportsTopic()] = false;
            $result['message'] = $exception->getMessage();
        }

        return $result;
    }
}
```

It requests with the already existing configuration further resources (e.g. nodes) that needs to be referred to in upcoming configurations as well.

### Analysis

An analysis status reporter can look like this:

```php
class AnalysisStatusReporter extends StatusReporterContract
{
    public function supportsTopic(): string
    {
        return self::TOPIC_ANALYSIS;
    }

    /**
     * @param Portal $portal
     */
    protected function run(PortalContract $portal, StatusReportingContextInterface $context): array
    {
        return [
            $this->supportsTopic() => true,
            'lastClientUsageTimestamp' => $context->getStorage()->get('apiClientLastUsage'),
        ];
    }
}
```

This status reporter relies on a feature the API client needs to implement as well: writing the last unix timestamp into the portal node storage. This way you can track the API clients behaviour.

### Information

An information status reporter can look like this:

```php
class InformationStatusReporter extends StatusReporterContract
{
    public function supportsTopic(): string
    {
        return self::TOPIC_INFO;
    }

    /**
     * @param Portal $portal
     */
    protected function run(PortalContract $portal, StatusReportingContextInterface $context): array
    {
        return [
            $this->supportsTopic() => true,
            'demo' => [
                'username' => 'root',
                'password' => 'password',
            ],
        ];
    }
}
```

The status reporter provides static information about possible debug configuration that does not need to be calculated. This can contain various of different types of information that suits the portal needs.
