# Logging

Logging is a crucial feature to understand actions of the application's insides.
Having a strategy for log inspection should be part of any project and prepared quite early as this speeds up development process.


## Concept

HEPTAconnect expects to have a [PSR compliant](https://www.php-fig.org/psr/psr-3/) logger to send all messages to.
The interface `\Psr\Log\LoggerInterface` provided from PSR is the abstraction layer that expects the [bridge](./bridges.md) to provide a logging implementation and allows the option to change the logger implementation by the integration.
Bridges by default fallback to log files placed on the filesystem to always have a solution running out of the box.
Integrations should specify a hosting-optimized logging facility that e.g. are scaling better.
All our currently available [bridges](./bridges.md) ship with the [monolog library](https://seldaek.github.io/monolog/) which allows for a quick setup for alternative logging providers.
When changing the logging facility you should document it properly so the administrator of your project can set up accordingly with the related [administration guide](../administrator/logs.md).
Log messages frequently contain unique codes that point to the origin of a message or an exception.
You can read more about them in a [news entry](/news/2022-05-17-exception-and-log-message-codes/) and [this ADR](../../reference/adr/2021-09-06-exception-and-log-message-codes.md).


## Sample configurations

### Graylog

Graylog is a service that can be setup quickly and provides log querying, dashboards and alerts over network and therefore can be used with multiple application instances.
It allows a [production installation](https://docs.graylog.org/docs/installing) but also a setup for a local/sneak-peek environment with the following docker-compose specification.

```yaml
version: '3'
services:
    mongo:
        image: mongo:4.2
        networks:
            - graylog
    elasticsearch:
        image: docker.elastic.co/elasticsearch/elasticsearch-oss:7.10.2
        environment:
            - http.host=0.0.0.0
            - transport.host=localhost
            - network.host=0.0.0.0
            - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
        ulimits:
            memlock:
                soft: -1
                hard: -1
        deploy:
            resources:
                limits:
                    memory : 1g
        networks:
            - graylog
    graylog:
        image: graylog/graylog:4.1
        environment:
            - GRAYLOG_PASSWORD_SECRET=somepasswordpepper
            - GRAYLOG_ROOT_PASSWORD_SHA2=8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
            - GRAYLOG_HTTP_EXTERNAL_URI=http://127.0.0.1:9000/
        networks:
            - graylog
        restart: always
        depends_on:
            - mongo
            - elasticsearch
        ports:
            - 9000:9000
            - 12201:12201
            - 12201:12201/udp
networks:
    graylog:
        driver: bridge
```

This will start the graylog webservice, which is hosted behind the URI of the environment variable `GRAYLOG_HTTP_EXTERNAL_URI`, and an additional port for log feeding.
The default credentials for this environment is `admin` / `admin`.
After starting the containers you have to define an input in graylog.
For this example we use the [gelf protocol](https://www.graylog.org/features/gelf) over UDP with the graylog default configuration.

The used gelf protocol expects this additional composer requirement `graylog2/gelf-php`.
As integrator, you can now start to override the bridge's logger definition `heptacom_heptaconnect.logger`.
This should depend on environment variables like `GELF_HOSTNAME` and `GELF_PORT` and can be implemented like this:

=== "config/services.yaml"

    ```yaml
    heptacom_heptaconnect.logger:
        class: Monolog\Logger
        arguments:
            - 'heptacom_heptaconnect'
            -
                -   !service
                    class: Monolog\Handler\GelfHandler
                    arguments:
                        -   !service
                            class: Gelf\Publisher
                            arguments:
                                -   !service
                                    class: Gelf\Transport\UdpTransport
                                    arguments:
                                        - '%env(string:GELF_HOSTNAME)%'
                                        - '%env(int:GELF_PORT)%'
    ```

=== "config/services.xml (alternative)"

    ```xml
    <?xml version="1.0" ?>
    <container
        xmlns="http://symfony.com/schema/dic/services"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd"
    >
        <services>
            <service id="heptacom_heptaconnect.logger" class="Monolog\Logger">
                <argument>heptacom_heptaconnect</argument>
                <argument type="collection">
                    <argument type="service">
                        <service class="Monolog\Handler\GelfHandler">
                            <argument type="service">
                                <service class="Gelf\Publisher">
                                    <argument type="service">
                                        <service class="Gelf\Transport\UdpTransport">
                                            <argument type="string">%env(string:GELF_HOSTNAME)%</argument>
                                            <argument type="string">%env(int:GELF_PORT)%</argument>
                                        </service>
                                    </argument>
                                </service>
                            </argument>
                        </service>
                    </argument>
                </argument>
            </service>
        </services>
    </container>
    ```

=== ".env"

    ```
    # Docker host ip-address
    GELF_HOSTNAME=127.0.0.1
    # same as graylog configured input port and docker port-forwarding
    GELF_PORT=12201
    ```
