# Use SPX extension as trigger for HTTP handler dumps

This pattern shows how to:

- Replace the `ServerRequestCycleDumpCheckerInterface` service to conditionally trigger dumps of HTTP requests
- Identify whether SPX is used for tracing to set the dump request attribute accordingly


## Integration

###### src/Core/SpxWebHttpDumpChecker.php

```php
<?php

declare(strict_types=1);

namespace Heptacom\HeptaConnect\Production\Core;

use Heptacom\HeptaConnect\Core\Web\Http\Dump\Contract\ServerRequestCycleDumpCheckerInterface
use Heptacom\HeptaConnect\Portal\Base\Web\Http\HttpHandlerStackIdentifier;
use Heptacom\HeptaConnect\Portal\Base\Web\Http\ServerRequestCycle;

final class SpxWebHttpDumpChecker implements ServerRequestCycleDumpCheckerInterface
{
    private bool $spxEnabled;

    private bool $spxAutoStart;

    public function __construct(bool $spxEnabled, bool $spxAutoStart)
    {
        $this->spxEnabled = $spxEnabled;
        $this->spxAutoStart = $spxAutoStart;
    }

    public function shallDump(HttpHandlerStackIdentifier $httpHandler, ServerRequestCycle $requestCycle): bool
    {
        return $this->isSpxActive();
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
                id="Heptacom\HeptaConnect\Core\Web\Http\Dump\Contract\ServerRequestCycleDumpCheckerInterface"
                class="Heptacom\HeptaConnect\Production\Core\SpxWebHttpDumpChecker"
            >
                <argument>%env(bool:SPX_ENABLED)%</argument>
                <argument>%env(bool:SPX_AUTO_START)%</argument>
            </service>
        </services>
    </container>
    ```

=== "config/services.yaml"

    ```yaml
    Heptacom\HeptaConnect\Core\Web\Http\Dump\Contract\ServerRequestCycleDumpCheckerInterface:
        class: Heptacom\HeptaConnect\Production\Core\SpxWebHttpDumpChecker
        arguments:
            - '%env(bool:SPX_ENABLED)%'
            - '%env(bool:SPX_AUTO_START)%'
    ```
