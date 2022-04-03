# Building storage actions

## Preparation

This guide assumes you have been using HEPTAconnect as an [integrator](../integrator/index.md) before.
A possible reason you are reading this is, that you want to [introduce a new flow component](./build-flow-components.md) and thus need to change the management storage layout to provide new interactions.


### Situation

A new flow component needs a new storage action to find out on which routes it is expected to action.
[Route capabilities](../../reference/adr/2021-10-30-route-capabilities.md) are the way to configure flow components on routes, so we can look out for existing patterns.
In case you are in a situation that is not already done in a similar way, have a look into [the ADR capturing our thoughts on storage actions](../../reference/adr/2021-09-25-optimized-storage-actions.md).

The next steps are:

* to define the interface by
    * defining parameters
    * defining result
* implement new tests
* implement in storage packages


### Storage action

Storage actions interfaces are grouped in sub namespaces of `\Heptacom\HeptaConnect\Storage\Base\Contract\Action\` depending on the storage component it affects.

```
<storage-base-source>
└── Contract
    └── Action
        ├── FileReference
        ├── Identity
        ├── IdentityError
        ├── Job
        ├── PortalExtension
        ├── PortalNode
        ├── PortalNodeAlias
        ├── PortalNodeConfiguration
        ├── PortalNodeStorage
        ├── Route
        ├── RouteCapability
        └── WebHttpHandlerConfiguration
```

Our situation requires to look into the route section as we want to query route data.
There we have the following actions at release of version 0.9.0.0.

```
<storage-base-source>
└── Contract
    └── Action
        └── Route
            ├── ReceptionRouteListActionInterface.php
            ├── RouteCreateActionInterface.php
            ├── RouteDeleteActionInterface.php
            ├── RouteFindActionInterface.php
            ├── RouteGetActionInterface.php
            └── RouteOverviewActionInterface.php
```

`ReceptionRouteListActionInterface` is the closest one to our situation, so we can copy it, but we will look into the next steps when designing a new action.


#### Storage action parameter

This storage action looks for routes by a certain criteria: the entity type in question and the source portal node.
To allow an extendable way to add new parameters without breaking the action interface, the parameters are grouped into a [DTO](https://en.wikipedia.org/wiki/Data_transfer_object) class implementing the `\Heptacom\HeptaConnect\Dataset\Base\Contract\AttachmentAwareInterface`.
This class is placed in a sub namespace that all DTOs share.
The namespace is similarly built compared to the namespace for the action interface.
For this situation it will be `\Heptacom\HeptaConnect\Storage\Base\Action\Route\Listing\` and can look like this:

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\Storage\Base\Action\Route\Listing;

use Heptacom\HeptaConnect\Dataset\Base\AttachmentCollection;
use Heptacom\HeptaConnect\Dataset\Base\Contract\AttachmentAwareInterface;
use Heptacom\HeptaConnect\Dataset\Base\Contract\DatasetEntityContract;
use Heptacom\HeptaConnect\Dataset\Base\Support\AttachmentAwareTrait;
use Heptacom\HeptaConnect\Portal\Base\StorageKey\Contract\PortalNodeKeyInterface;

final class FindRouteListCriteria implements AttachmentAwareInterface
{
    use AttachmentAwareTrait;

    protected PortalNodeKeyInterface $sourcePortalNodeKey;

    /**
     * @var class-string<DatasetEntityContract>
     */
    protected string $entityType;

    /**
     * @param class-string<DatasetEntityContract> $entityType
     */
    public function __construct(PortalNodeKeyInterface $sourcePortalNodeKey, string $entityType)
    {
        $this->attachments = new AttachmentCollection();
        $this->sourcePortalNodeKey = $sourcePortalNodeKey;
        $this->entityType = $entityType;
    }

    public function getSourcePortalNodeKey(): PortalNodeKeyInterface
    {
        return $this->sourcePortalNodeKey;
    }

    public function setSourcePortalNodeKey(PortalNodeKeyInterface $sourcePortalNodeKey): void
    {
        $this->sourcePortalNodeKey = $sourcePortalNodeKey;
    }

    /**
     * @return class-string<DatasetEntityContract>
     */
    public function getEntityType(): string
    {
        return $this->entityType;
    }

    /**
     * @param class-string<DatasetEntityContract> $entityType
     */
    public function setEntityType(string $entityType): void
    {
        $this->entityType = $entityType;
    }
}
```


#### Storage result

As the result is a list we can either go for a collection class or an iterable of returning each row.
Using iterables through generators is good as it can reduce memory usage as not all rows have to be present in memory at once.
Generators in implementations are only a bad choice, when the actions are meant to perform write operations in the storage, as these methods are only executed when an iteration happens and therefore might not happen.
In our situation we only load data from the storage and can go for an iterator expectation.
Consequently, we only need a single class: a DTO class to hold a single result.

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\Storage\Base\Action\Route\Listing;

use Heptacom\HeptaConnect\Dataset\Base\AttachmentCollection;
use Heptacom\HeptaConnect\Dataset\Base\Contract\AttachmentAwareInterface;
use Heptacom\HeptaConnect\Dataset\Base\Support\AttachmentAwareTrait;
use Heptacom\HeptaConnect\Storage\Base\Contract\RouteKeyInterface;

final class FindRouteListResult implements AttachmentAwareInterface
{
    use AttachmentAwareTrait;

    protected RouteKeyInterface $routeKey;

    public function __construct(RouteKeyInterface $routeKey)
    {
        $this->attachments = new AttachmentCollection();
        $this->routeKey = $routeKey;
    }

    public function getRouteKey(): RouteKeyInterface
    {
        return $this->routeKey;
    }
}
```


#### Storage action interface

As we finished everything what goes in and goes out, we can now define the interface:

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\Storage\Base\Contract\Action\Route;

use Heptacom\HeptaConnect\Storage\Base\Action\Route\Listing\FindRouteListCriteria;
use Heptacom\HeptaConnect\Storage\Base\Action\Route\Listing\FindRouteListResult;
use Heptacom\HeptaConnect\Storage\Base\Exception\UnsupportedStorageKeyException;

interface FindRouteListActionInterface
{
    /**
     * List all routes for a find scenario.
     *
     * @throws UnsupportedStorageKeyException
     *
     * @return iterable<FindRouteListResult>
     */
    public function list(FindRouteListCriteria $criteria): iterable;
}
```

It is important to write a comment onto the interface to define an expectation for writing the tests, using the action and implementing the action.
Actions are provided by a factory implementing the `\Heptacom\HeptaConnect\Storage\Base\Bridge\Contract\StorageFacadeInterface`.
When introducing this new storage action interface, a new method has to be added to the storage facade interface to get an instance of the storage action implementation.
With a modified interface, every implementation and related test needs to be adjusted as well.


### Storage test suite

Tests for the storage are defined in the `heptacom/heptaconnect-test-suite-storage` of the framework.
This set of tests can be used by all storage implementations to test against.
A test in the test suite is an abstract class that expects to be run by phpunit.
To provide the implementation to test, an abstract method to provide a `\Heptacom\HeptaConnect\Storage\Base\Bridge\Contract\StorageFacadeInterface` 
In general, you will find a lifecycle test in these tests.
A lifecycle test is like an e2e (end to end) test, but for data.
So we create data, query data, modify data, query data, delete data and query data again.
It can look like this:

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\TestSuite\Storage\Action;

use Heptacom\HeptaConnect\Portal\Base\StorageKey\PortalNodeKeyCollection;
use Heptacom\HeptaConnect\Storage\Base\Action\PortalNode\Create\PortalNodeCreatePayload;
use Heptacom\HeptaConnect\Storage\Base\Action\PortalNode\Create\PortalNodeCreatePayloads;
use Heptacom\HeptaConnect\Storage\Base\Action\PortalNode\Create\PortalNodeCreateResult;
use Heptacom\HeptaConnect\Storage\Base\Action\PortalNode\Delete\PortalNodeDeleteCriteria;
use Heptacom\HeptaConnect\Storage\Base\Action\Route\Create\RouteCreatePayload;
use Heptacom\HeptaConnect\Storage\Base\Action\Route\Create\RouteCreatePayloads;
use Heptacom\HeptaConnect\Storage\Base\Action\Route\Delete\RouteDeleteCriteria;
use Heptacom\HeptaConnect\Storage\Base\Action\Route\Listing\FindRouteListCriteria;
use Heptacom\HeptaConnect\Storage\Base\Bridge\Contract\StorageFacadeInterface;
use Heptacom\HeptaConnect\Storage\Base\Enum\RouteCapability;
use Heptacom\HeptaConnect\Storage\Base\Exception\NotFoundException;
use Heptacom\HeptaConnect\Storage\Base\RouteKeyCollection;
use Heptacom\HeptaConnect\TestSuite\Storage\Fixture\Dataset\EntityA;
use Heptacom\HeptaConnect\TestSuite\Storage\Fixture\Portal\PortalA\PortalA;
use Heptacom\HeptaConnect\TestSuite\Storage\Fixture\Portal\PortalB\PortalB;
use Heptacom\HeptaConnect\TestSuite\Storage\TestCase;

/**
 * Test pre-implementation to test find route related storage actions. Some other storage actions e.g. PortalNodeCreate are needed to set up test scenarios.
 */
abstract class FindRouteTestContract extends TestCase
{
    /**
     * Validates a complete find route "lifecycle" can be managed with the storage. It covers creation, usage, configuration and deletion of routes.
     */
    public function testLifecycle(): void
    {
        $facade = $this->createStorageFacade();
        $portalNodeCreateAction = $facade->getPortalNodeCreateAction();
        $portalNodeDeleteAction = $facade->getPortalNodeDeleteAction();
        $routeCreateAction = $facade->getRouteCreateAction();
        $routeFindRouteListAction = $facade->getFindRouteListAction();
        $routeDeleteAction = $facade->getRouteDeleteAction();

        $portalNodeCreateResult = $portalNodeCreateAction->create(new PortalNodeCreatePayloads([
            new PortalNodeCreatePayload(PortalA::class),
            new PortalNodeCreatePayload(PortalB::class),
        ]));
        $firstResult = $portalNodeCreateResult->first();
        $lastResult = $portalNodeCreateResult->last();

        static::assertInstanceOf(PortalNodeCreateResult::class, $firstResult);
        static::assertInstanceOf(PortalNodeCreateResult::class, $lastResult);
        static::assertNotSame($firstResult, $lastResult);

        $portalA = $firstResult->getPortalNodeKey();
        $portalB = $lastResult->getPortalNodeKey();

        $createPayloads = new RouteCreatePayloads([        
            new RouteCreatePayload($portalB, $portalA, EntityA::class, [RouteCapability::FIND]),
            new RouteCreatePayload($portalA, $portalB, EntityA::class, [RouteCapability::FIND]),
        ]);

        $createResults = $routeCreateAction->create($createPayloads);
        static::assertCount($createPayloads->count(), $createResults);
        
        $findListResult = \iterable_to_array($routeFindRouteListAction->find(new FindRouteListCriteria($portalA, EntityA::class)));

        static::assertCount(1, $findListResult);

        $routeDeleteAction->delete(new RouteDeleteCriteria($routeKeys));

        $findListResult = \iterable_to_array($routeFindRouteListAction->find(new FindRouteListCriteria($portalA, EntityA::class)));

        static::assertCount(0, $findListResult);

        try {
            $this->routeDeleteAction->delete(new RouteDeleteCriteria(new RouteKeyCollection([$findListResult[0]->getRouteKey()])));
            static::fail('This should have been throwing a not found exception');
        } catch (NotFoundException $exception) {
        }

        $portalNodeDeleteAction->delete(new PortalNodeDeleteCriteria(new PortalNodeKeyCollection([$portalA, $portalB])));
    }

    /**
     * Provides the storage implementation to test against.
     */
    abstract protected function createStorageFacade(): StorageFacadeInterface;
}
```


### Storage implementation

Without getting into too many details we have for tooling for performant SQL queries in our `doctrine/dbal` based storage, here some points we look out for when implementing these actions.

1. To track down issues with SQL queries, we add publicly known unique query identifiers as a comment to recognise them quickly in logs and profilers
2. Every write operation is wrapped in a transactional operation to ensure batch writes are either done completely or rolled back
3. Every select statement is ensured to be paginated to keep package sizes in a certain level
4. Every paginated query is ensured to have a proper order by statement
5. Every select needs to only use indices for queries
6. Implement every abstract test provided by the `heptacom/heptaconnect-test-suite-storage` package
