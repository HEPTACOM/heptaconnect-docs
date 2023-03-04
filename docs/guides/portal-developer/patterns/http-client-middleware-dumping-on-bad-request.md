# HttpClientMiddleware dumping HTTP messages on a "bad request" response

This pattern shows how to:

- access portal node specific filesystem using the [FilesystemInterface](../filesystem.md)
- record outbound request-response pairs using a [HttpClientMiddlewareInterface](../http-client-middleware.md)
- dump HTTP messages using [Psr7MessageFormatterContract](../default-utilities.md#psr7messagerawhttpformattercontract)

## Portal

###### src/Http/Client/Middleware/BadRequestsDumpingMiddleware.php

```php
<?php

declare(strict_types=1);

namespace Portal\Http\Client\Middleware;

use Heptacom\HeptaConnect\Portal\Base\File\Filesystem\Contract\FilesystemInterface;
use Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\HttpClientMiddlewareInterface;
use Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\Psr7MessageFormatterContract;
use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;

final class BadRequestsDumpingMiddleware implements HttpClientMiddlewareInterface
{
    private Psr7MessageFormatterContract $formatter;

    private FilesystemInterface $filesystem;

    public function __construct(Psr7MessageFormatterContract $formatter, FilesystemInterface $filesystem)
    {
        $this->formatter = $formatter;
        $this->filesystem = $filesystem;
    }

    public function process(RequestInterface $request, ClientInterface $handler): ResponseInterface
    {
        $response = $handler->sendRequest($request);
        
        if (400 <= $response->getStatusCode() && $response->getStatusCode() < 500) {
            $dumpDir = $this->filesystem->toStoragePath(sprintf('bad-requests/%s-%s-', time(), uniqid()));
            $message = $this->formatter->formatMessage($request);
            $extension = $this->formatter->getFileExtension($request);
            
            file_put_contents($dumpDir . 'request.' . $extension, $message);

            $message = $this->formatter->formatMessage($response);
            $extension = $this->formatter->getFileExtension($response);
            
            file_put_contents($dumpDir . 'response.' . $extension, $message);
        }

        return $response;
    }
}
```
