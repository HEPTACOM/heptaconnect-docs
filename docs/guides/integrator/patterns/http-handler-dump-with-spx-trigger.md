# Use SPX extension as trigger for HTTP handler dumps

This pattern shows how to:

- Decorate the HttpHandleServiceInterface to conditionally set the dump request attribute
- Identify whether SPX is used for tracing to set the dump request attribute accordingly


## Integration

###### src/Core/SpxDumpTriggeringHttpHandleService.php

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\Production\Core;

use Heptacom\HeptaConnect\Core\Web\Http\Contract\HttpHandleServiceInterface;
use Heptacom\HeptaConnect\Portal\Base\StorageKey\Contract\PortalNodeKeyInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class SpxDumpTriggeringHttpHandleService implements HttpHandleServiceInterface
{
    private HttpHandleServiceInterface $decorated;

    private bool $spxEnabled;

    private bool $spxAutoStart;

    public function __construct(HttpHandleServiceInterface $decorated, bool $spxEnabled, bool $spxAutoStart)
    {
        $this->decorated = $decorated;
        $this->spxEnabled = $spxEnabled;
        $this->spxAutoStart = $spxAutoStart;
    }

    public function handle(ServerRequestInterface $request, PortalNodeKeyInterface $portalNodeKey): ResponseInterface
    {
        if ($this->isSpxActive()) {
            $request = $request->withAttribute(HttpHandleServiceInterface::REQUEST_ATTRIBUTE_DUMPS_EXPECTED, true);
        }

        return $this->decorated->handle($request, $portalNodeKey);
    }

    private function isSpxActive(): bool
    {
        if (!\extension_loaded('spx')) {
            return false;
        }

        return $this->spxEnabled && $this->spxAutoStart;
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
                id="Heptacom\HeptaConnect\Production\Core\SpxDumpTriggeringHttpHandleService"
                decorates="Heptacom\HeptaConnect\Core\Web\Http\Contract\HttpHandleServiceInterface"
            >
                <argument
                    id="Heptacom\HeptaConnect\Production\Core\SpxDumpTriggeringHttpHandleService.inner"
                    type="service"
                />
                <argument>%env(bool:SPX_ENABLED)%</argument>
                <argument>%env(bool:SPX_AUTO_START)%</argument>
            </service>
        </services>
    </container>
    ```

=== "config/services.yaml"

    ```yaml
    Heptacom\HeptaConnect\Production\Core\SpxDumpTriggeringHttpHandleService:
        decorates: Heptacom\HeptaConnect\Core\Web\Http\Contract\HttpHandleServiceInterface
        arguments:
            - '@Heptacom\HeptaConnect\Production\Core\SpxDumpTriggeringHttpHandleService.inner'
            - '%env(bool:SPX_ENABLED)%'
            - '%env(bool:SPX_AUTO_START)%'
    ```
