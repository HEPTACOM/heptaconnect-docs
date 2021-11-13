# HTTP Handler

A portal can respond to HTTP request using HTTP handlers.
This can be useful for implementing webhooks or web browser interaction (like for an OAuth 2.0 setup).

## Intention

Many external systems support notifications for changes via webhooks.
Some systems only send identifiers of affected entities while others send the entire entity or only the change set.
Portals can process these notifications by implementing an HTTP handler.
For maximum flexibility, handlers are provided with the entire HTTP request object and a prepared HTTP response object that should be modified.
The HTTP message objects implement `\Psr\Http\Message\ServerRequestInterface` and `\Psr\Http\Message\ResponseInterface` defined in [`PSR-7`](https://www.php-fig.org/psr/psr-7/).

It is recommended to keep the operations in HTTP handlers as lightweight as possible, because these components will run in a web context where arbitrary memory limits and time limits can apply.
For webhook notifications containing only identities, the handler should use the [`\Heptacom\HeptaConnect\Portal\Base\Publication\Contract\PublisherInterface`](./default-utilities.md#publisherinterface) to offload further I/O into an emitter.
Webhooks that receive entire entity payloads can a packer and dispatch entities immediately to the [`\Heptacom\HeptaConnect\Portal\Base\Flow\DirectEmission\DirectEmissionFlowContract`](./default-utilities.md#directemissionflowcontract)

## Usage

=== "object-oriented notation"

    ```php
    use Heptacom\HeptaConnect\Playground\Dataset\Bottle;
    use Heptacom\HeptaConnect\Portal\Base\Mapping\MappingComponentCollection;
    use Heptacom\HeptaConnect\Portal\Base\Mapping\MappingComponentStruct;
    use Heptacom\HeptaConnect\Portal\Base\Publication\Contract\PublisherInterface;
    use Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\HttpHandleContextInterface;
    use Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\HttpHandlerContract;
    use Psr\Http\Message\ResponseInterface;
    use Psr\Http\Message\ServerRequestInterface;
    
    class BottleHttpHandler extends HttpHandlerContract
    {
        private PublisherInterface $publisher;
    
        public function __construct(PublisherInterface $publisher)
        {
            $this->publisher = $publisher;
        }
    
        protected function supports(): string
        {
            return 'bottle';
        }
    
        protected function post(
            ServerRequestInterface $request,
            ResponseInterface $response,
            HttpHandleContextInterface $context
        ): ResponseInterface {
            $bottleIds = \json_decode($request->getQueryParams()['bottle-ids']);
    
            $bottleMappings = \array_map(static fn (string $bottleId) => new MappingComponentStruct(
                $context->getPortalNodeKey(),
                Bottle::class,
                $bottleId
            ), $bottleIds);
    
            $this->publisher->publishBatch(new MappingComponentCollection($bottleMappings));
    
            return $response->withStatus(201);
        }
    }
    ```

=== "short notation"

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
