# Use Xdebug extension as trigger for HTTP handler dumps

This pattern shows how to:

- Replace the `ServerRequestCycleDumpCheckerInterface` service to conditionally trigger dumps of HTTP requests
- Identify whether Xdebug is used for debugging to set the dump request attribute accordingly


## Integration

###### src/Core/XdebugWebHttpDumpChecker.php

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\Production\Core;

use Heptacom\HeptaConnect\Core\Web\Http\Dump\Contract\ServerRequestCycleDumpCheckerInterface
use Heptacom\HeptaConnect\Portal\Base\Web\Http\HttpHandlerStackIdentifier;
use Heptacom\HeptaConnect\Portal\Base\Web\Http\ServerRequestCycle;

final class XdebugWebHttpDumpChecker implements ServerRequestCycleDumpCheckerInterface
{
    public function shallDump(HttpHandlerStackIdentifier $httpHandler, ServerRequestCycle $requestCycle): bool
    {
        return $this->isXdebugEnabled();
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
                id="Heptacom\HeptaConnect\Core\Web\Http\Dump\Contract\ServerRequestCycleDumpCheckerInterface"
                class="Heptacom\HeptaConnect\Production\Core\XdebugWebHttpDumpChecker"
            />
        </services>
    </container>
    ```

=== "config/services.yaml"

    ```yaml
    Heptacom\HeptaConnect\Core\Web\Http\Dump\Contract\ServerRequestCycleDumpCheckerInterface:
        class: Heptacom\HeptaConnect\Production\Core\XdebugWebHttpDumpChecker
    ```
