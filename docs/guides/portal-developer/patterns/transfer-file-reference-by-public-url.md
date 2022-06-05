# File reference with public URLs

This pattern shows how to:

- Let two portals transfer a file via [file references](../../guides/portal-developer/file-reference.md)
- Add configuration to a portal to toggle behaviour
- Separate API usage from entity processing

## Portal A

###### src/Resources/flow-component/media-emit.php

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Dataset\Ecommerce\Media\Media;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use Heptacom\HeptaConnect\Portal\Base\File\FileReferenceFactoryContract;

FlowComponent::explorer(Media::class)
    ->run(static fn (): iterable => [
        'https://picsum.photos/seed/php/300/300',
        'https://picsum.photos/seed/is/300/300',
        'https://picsum.photos/seed/nice/300/300',
    ]);

FlowComponent::emitter(Media::class)
    ->run(static function (string $externalId, FileReferenceFactoryContract $fileReferenceFactory): Media {
        $result = new Media();
        $result->setPrimaryKey($externalId);
        // externalId is a URL as used in the explorer a few lines above
        $result->setFile($fileReferenceFactory->fromPublicUrl($externalId));
        return $result;
    });
```


## Portal B

###### src/Resources/flow-component/media-receive.php

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Documentation\PortalB\Api\Client;
use Heptacom\HeptaConnect\Dataset\Base\File\FileReferenceContract;
use Heptacom\HeptaConnect\Dataset\Ecommerce\Media\Media;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use Heptacom\HeptaConnect\Portal\Base\File\FileReferenceResolverContract;

FlowComponent::receiver(Media::class)
    ->run(static function (Media $entity, FileReferenceResolverContract $fileReferenceResolver, Client $client, bool $configUpload): void {
        $resolvedFile = $fileReferenceResolver->resolve($entity->getFile());
        
        if ($configUpload) {
            $mediaLocation = $client->uploadBlob($resolvedFile);
        } else {
            $mediaLocation = $client->importBlob($resolvedFile);
        }        
        
        $entity->setPrimaryKey($mediaLocation);
    });
```

###### src/Portal.php

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\Documentation\PortalB;

use Heptacom\HeptaConnect\Portal\Base\Portal\Contract\PortalContract;
use Symfony\Component\OptionsResolver\OptionsResolver;

class Portal extends PortalContract
{
    public function getConfigurationTemplate(): OptionsResolver
    {
        return parent::getConfigurationTemplate()
            ->addAllowedTypes('upload', 'bool')
            ->setDefault('upload', false);
    }
}

```

###### src/Api/Client.php

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\Documentation\PortalB\Api;

use Heptacom\HeptaConnect\Dataset\Base\File\FileReferenceContract;
use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use Heptacom\HeptaConnect\Portal\Base\File\FileReferenceResolverContract;
use Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\HttpClientContract;
use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;

class Client
{
    private ClientInterface $client;
    
    private RequestFactoryInterface $requestFactory;
    
    private StreamFactoryInterface $streamFactory;
    
    public function __construct(
        HttpClientContract $client,
        RequestFactoryInterface $requestFactory,
        StreamFactoryInterface $streamFactory
    ) {
        $this->client = $client;
        $this->requestFactory = $requestFactory;
        $this->streamFactory = $streamFactory;
    }

    public function uploadBlob(FileReferenceContract $file): string
    {
        $request = $this->requestFactory->createRequest('POST', 'https://onlineshop.test/api/media/upload');
        $request = $request->withHeader('Content-Type', 'application/octet-stream');
        $request = $request->withBody($this->streamFactory->createStream(
            $file->getContents()
        ));
        $response = $this->client->sendRequest($request);
        
        return $response->getHeaderLine('Location');
    }

    public function importBlob(FileReferenceContract $file): string
    {
        $request = $this->requestFactory->createRequest('POST', 'https://onlineshop.test/api/media/import');
        $request = $request->withHeader('Content-Type', 'application/json');
        $request = $request->withBody($this->streamFactory->createStream(\json_encode([
            'url' => $file->getPublicUrl(),
        ])));
        $response = $this->client->sendRequest($request);
        
        return $response->getHeaderLine('Location');
    }
}
```
