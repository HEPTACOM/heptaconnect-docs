{
    "date": "2021-12-07",
    "title": "HTTP handler flow component",
    "summary": "HTTP handlers for webhook, OAuth flows and hosting files",
    "author": "Joshua Behrens"
}
---

## TL;DR

- New flow component: HTTP handler

In the last news the new documentation structure and engine have been celebrated.
Now we can suggest once again to read into the new pages about our new flow component: [HTTP handler](https://heptaconnect.io/guides/portal-developer/http-handler/).
This new component already has some configuration which can be managed as administrator that can be read upon in the [HTTP APIs](https://heptaconnect.io/guides/administrator/http-apis/) page of the administrator section.


## Underlying technology

We rely fully on [`PSR-7`](https://www.php-fig.org/psr/psr-7/) and [`PSR-17`](https://www.php-fig.org/psr/psr-17/).
Unfortunately [`PSR-15`](https://www.php-fig.org/psr/psr-15/) does not fit into our just released HTTP handler structure.
It behaves similar to other flow components in terms of stacked processing, extensibility by portal extensions and integrations, ability to write definition in a short-notation and an object-oriented manner.


## New flow options

In the past you had to be an integration to host an HTTP controller to create an event driven flow over HTTP messages.
With HTTP handlers at hand you can now use incoming web requests and transfer them into publications or already a direct emission.
We already use it in the Business Central portal to build an OAuth 2 authentication flow.
The following example shows how to convert an incoming request into a publication of external ids about new data that is ready to pick up.

```php
use Heptacom\HeptaConnect\Playground\Dataset\Bottle;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use Heptacom\HeptaConnect\Portal\Base\Mapping\MappingComponentCollection;
use Heptacom\HeptaConnect\Portal\Base\Mapping\MappingComponentStruct;
use Heptacom\HeptaConnect\Portal\Base\StorageKey\Contract\PortalNodeKeyInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

FlowComponent::httpHandler('bottle')->post(static function (
    ServerRequestInterface $request,
    ResponseInterface $response,
    PortalNodeKeyInterface $portalNodeKey
): ResponseInterface {
    $bottleIds = \json_decode($request->getQueryParams()['bottle-ids']);

    $bottleMappings = \array_map(static fn (string $bottleId) => new MappingComponentStruct(
        $portalNodeKey,
        Bottle::class,
        $bottleId
    ), $bottleIds);

    $this->publisher->publishBatch(new MappingComponentCollection($bottleMappings));

    return $response->withStatus(201);
});
```

Direct emission based flows can be created quickly when you already use [packers to pack](https://heptaconnect.io/reference/glossary/#packer) API data into HEPTAconnect entities.
With packers at hand you can use the request body, pass it into the packer and use the packed entity directly into the [DirectEmissionFlow](https://heptaconnect.io/guides/portal-developer/default-utilities/#directemissionflowcontract).
