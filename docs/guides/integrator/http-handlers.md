# HTTP Handlers

HEPTAconnect exposes HTTP endpoints by portals.
Handling of these HTTP handlers can be tuned for e.g. debugging.


## Debugging dumps of HTTP messages

HEPTAconnect ships a request-response dump feature for HTTP handlers using request attributes defined in `\Heptacom\HeptaConnect\Core\Web\Http\Contract\HttpHandleServiceInterface`.
This attribute is already set by features provided by [bridges e.g. using a sampling rate](../administrator/http-apis.md#debugging).


### Dump format

The dumped HTTP messages are formatted using the `Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\Psr7MessageFormatterContract` service.
You can override this service definition to change the formatting of the dumped messages.
Without any changes the dumped messages are in a raw HTTP format, so it could be used together with `nc` (netcat) or `telnet` to replay the requests.
If you want to replay messages with `curl` you can use the `Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\Psr7MessageCurlShellFormatterContract` service instead.
Read [here about recording](./patterns/http-handler-dump-format-to-curl-shell-scripts.md).
The dumped request can be passed into the standard input using shell pipes:

=== "netcat"

    ```xml
    cat dump.http | nc localhost 8000
    ```

=== "telnet"

    ```bash
    cat dump.http | telnet localhost 8000
    ```

=== "IDEs"

    The HTTP request dump can be opened and replayed in IDEs from IntelliJ like WebStorm and PHPStorm and Microsoft Visual Studio.


### Trigger dumps

If you want to introduce a new trigger to dump HTTP messages, you can decorate the `\Heptacom\HeptaConnect\Core\Web\Http\Contract\HttpHandleServiceInterface` service.
Combining triggers of other development tools like [SPX](https://github.com/NoiseByNorthwest/php-spx) or [Xdebug](https://xdebug.org/) is a helpful approach.
Read about the integration of [SPX here](./patterns/http-handler-dump-with-spx-trigger.md) and about the integration of [Xdebug here](./patterns/http-handler-dump-with-xdebug-trigger.md).
Adjusting the trigger to your needs is a good way to reduce the amount of dumped messages.
So we also [provide an example](./patterns/http-handler-dump-only-on-errors.md) to show how to dump HTTP messages only on errors.
