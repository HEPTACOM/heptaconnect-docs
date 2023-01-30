# Use Xdebug extension as trigger for HTTP handler dumps

This pattern shows how to:

- Decorate the HttpHandleServiceInterface to conditionally set the dump request attribute
- Identify whether Xdebug is used for debugging to set the dump request attribute accordingly


## Integration

###### src/Core/XdebugDumpTriggeringHttpHandleService.php

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\Production\Core;

use Heptacom\HeptaConnect\Core\Web\Http\Contract\HttpHandleServiceInterface;
use Heptacom\HeptaConnect\Portal\Base\StorageKey\Contract\PortalNodeKeyInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class XdebugDumpTriggeringHttpHandleService implements HttpHandleServiceInterface
{
    private HttpHandleServiceInterface $decorated;

    public function __construct(HttpHandleServiceInterface $decorated)
    {
        $this->decorated = $decorated;
    }

    public function handle(ServerRequestInterface $request, PortalNodeKeyInterface $portalNodeKey): ResponseInterface
    {
        if ($this->isXdebugEnabled()) {
            $request = $request->withAttribute(HttpHandleServiceInterface::REQUEST_ATTRIBUTE_DUMPS_EXPECTED, true);
        }

        return $this->decorated->handle($request, $portalNodeKey);
    }

    private function isXdebugEnabled(): bool
    {
        if (!\extension_loaded('xdebug')) {
            return false;
        }

        if (!\function_exists('xdebug_info')) {
            return false;
        }

        $xdebugMode = \xdebug_info('mode');

        return !empty($xdebugMode);
    }
}
```


###### config/services.?

=== "config/services.xml"

    ```xml
    <?xml version="1.0" ?>
    <container
        xmlns="http://symfony.com/schema/dic/services"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd"
    >
        <services>
            <service
                id="Heptacom\HeptaConnect\Production\Core\XdebugDumpTriggeringHttpHandleService"
                decorates="Heptacom\HeptaConnect\Core\Web\Http\Contract\HttpHandleServiceInterface"
            >
                <argument
                    id="Heptacom\HeptaConnect\Production\Core\XdebugDumpTriggeringHttpHandleService.inner"
                    type="service"
                />
            </service>
        </services>
    </container>
    ```

=== "config/services.yaml"

    ```yaml
    Heptacom\HeptaConnect\Production\Core\XdebugDumpTriggeringHttpHandleService:
        decorates: Heptacom\HeptaConnect\Core\Web\Http\Contract\HttpHandleServiceInterface
        arguments:
            - '@Heptacom\HeptaConnect\Production\Core\XdebugDumpTriggeringHttpHandleService.inner'
    ```
