# Change the dump format for HTTP handler communication to cURL shell

This pattern shows how to:

- Change a service alias to set format of HTTP message dumping to `curl` shell scripts

## Integration

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
                id="Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\Psr7MessageFormatterContract"
                alias="Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\Psr7MessageRawHttpFormatterContract"
            />
        </services>
    </container>
    ```

=== "config/services.yaml"

    ```yaml
    Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\Psr7MessageFormatterContract:
        alias: Heptacom\HeptaConnect\Portal\Base\Web\Http\Contract\Psr7MessageCurlShellFormatterContract
    ```
