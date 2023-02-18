# Decorate HTTP handler dump checker to only dump on errors

This pattern shows how to:

- Replace the ServerRequestCycleDumpCheckerInterface service to conditionally trigger dumps of HTTP requests
- Identify whether a response contains an error


## Integration

###### src/Core/ErrorOnlyWebHttpDumpChecker.php

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\Production\Core;

use Heptacom\HeptaConnect\Core\Web\Http\Dump\Contract\ServerRequestCycleDumpCheckerInterface
use Heptacom\HeptaConnect\Portal\Base\Web\Http\HttpHandlerStackIdentifier;
use Heptacom\HeptaConnect\Portal\Base\Web\Http\ServerRequestCycle;

final class ErrorOnlyWebHttpDumpChecker implements ServerRequestCycleDumpCheckerInterface
{
    private ServerRequestCycleDumpCheckerInterface $decorated;

    public function __construct(ServerRequestCycleDumpCheckerInterface $decorated)
    {
        $this->decorated = $decorated;
    }

    public function shallDump(HttpHandlerStackIdentifier $httpHandler, ServerRequestCycle $requestCycle): bool
    {
        if ($requestCycle->getResponse()->getStatusCode() < 400) {
            return false;
        }
    
        return $this->decorated->shallDump($httpHandler, $requestCycle);
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
                id="Heptacom\HeptaConnect\Production\Core\ErrorOnlyWebHttpDumpChecker"
                decorates="Heptacom\HeptaConnect\Core\Web\Http\Dump\Contract\ServerRequestCycleDumpCheckerInterface"
            >
                <argument type="service" id="Heptacom\HeptaConnect\Production\Core\ErrorOnlyWebHttpDumpChecker.inner"/>
            </service>
        </services>
    </container>
    ```

=== "config/services.yaml"

    ```yaml
    Heptacom\HeptaConnect\Production\Core\ErrorOnlyWebHttpDumpChecker
        decorates: Heptacom\HeptaConnect\Core\Web\Http\Dump\Contract\ServerRequestCycleDumpCheckerInterface
        arguments:
            - '@Heptacom\HeptaConnect\Production\Core\ErrorOnlyWebHttpDumpChecker.inner'
    ```
