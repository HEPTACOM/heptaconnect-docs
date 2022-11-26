# Serve a file from filesystem using HTTP handler

This pattern shows how to:

- To access portal node specific filesystem using the [FilesystemInterface](../filesystem.md)
- To response with a binary file using an [HTTP handler](../http-handler.md)

## Portal

###### src/Resources/flow-component/list-files.php

```php
<?php

declare(strict_types=1);

use Heptacom\HeptaConnect\Portal\Base\Builder\FlowComponent;
use Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamFactoryInterface;

FlowComponent::httpHandler('logo.png')
    ->get(static function (
        FilesystemInterface $fs,
        ResponseInterface $response,
        StreamFactoryInterface $streamFactory
    ): ResponseInterface {
        $path = $fs->toStoragePath('logo.png');
        
        if (is_file($path)) {
            return $response->withStatus(404);
        }
        
        return $response
            ->withStatus(200)
            ->withHeader('Content-Type', 'image/png')
            ->withBody($streamFactory->createStreamFromFile($path));
    });
```
