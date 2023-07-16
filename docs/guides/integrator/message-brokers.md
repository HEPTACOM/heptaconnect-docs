# Message broking

A message broking system has three types of participants: Sender, broker and consumer.
HEPTAconnect builds upon message broking for task splitting over multiple processing units.
Learn how to integrate message broking into your project.


## Integrate a message broker

There is no all-fit solution as this heavily depends on the development and hosting environment in your project.
Nonetheless, we can provide useful tips for your project from our experience.


## Choose a message broker

For local development it is useful to use a relational-database-driven message broker.
That makes it more comprehensive as it enables quick access to the message content.
The downside is that a relational-database-engine is not well optimized for message broking, so it will neither be fast nor well performing with multiple message consumers.

For production environments you should ask your hosting provider what good services they have at hand.
In the past we made good experience with [Redis](https://redis.io/), [RabbitMQ](https://www.rabbitmq.com/) and [Amazon SQS](https://aws.amazon.com/de/sqs/).


## Bridge support

Depending on the bridge you choose the configuration differs.
You will probably find your use-case below and copy the requirements.
It is common to use multiple solutions in the same project to allow different environments like local development and production hosting.
Changing between the solutions is best done via environment variables.
Ensure to document the message broker, so you can get new persons aboard nicely.


### Shopware 6 - Database

Shopware by default ships with the [enqueue library](https://github.com/php-enqueue/enqueue-dev) and a database table called `enqueue`.
This allows for no additional required work to use HEPTAconnect with a message broker. 


### Shopware 6 - Redis

Shopware by default ships with the [enqueue library](https://github.com/php-enqueue/enqueue-dev) so the following is an explanation [how to configure](https://php-enqueue.github.io/transport/redis/) it.
This example expects a Redis service running on the local system `127.0.0.1`, is accessible on the port `6379` and use the database `1`.
Configure the following files that are placed in your Shopware 6 project:

```shell
pecl install redis
```

=== "config/packages/enqueue.yaml"

    ```
    enqueue:
        redis:
            transport: '%env(MESSAGE_BROKER_REDIS_URL)%'
            client: ~
    ```

=== "config/packages/framework.yaml"

    ```
    framework:
        messenger:
            transports:
                default:
                    dsn: '%env(MESSAGE_BROKER_DSN)%'
    ```

=== ".env"

    ```
    MESSAGE_BROKER_REDIS_URL="redis://127.0.0.1:6379/1"
    MESSAGE_BROKER_DSN="enqueue://redis"
    ```


### Shopware 6 - RabbitMQ

Shopware by default ships with the [enqueue library](https://github.com/php-enqueue/enqueue-dev) so the following is an explanation [how to configure](https://php-enqueue.github.io/transport/amqp_bunny/) it.
This example expects a RabbitMQ service running on the local system `127.0.0.1`, is accessible on the port `5672` with the credentials `guest` / `guest`.
Configure the following files that are placed in your Shopware 6 project:

```shell
pecl install amqp
```

=== "config/packages/enqueue.yaml"

    ```
    enqueue:
        rabbitmq:
            transport:
                dsn: '%env(MESSAGE_BROKER_RABBITMQ_URL)%'
            client: ~
    ```

=== "config/packages/framework.yaml"

    ```
    framework:
        messenger:
            transports:
                default:
                    dsn: '%env(MESSAGE_BROKER_DSN)%'
    ```

=== ".env"

    ```
    MESSAGE_BROKER_RABBITMQ_URL="amqp://guest:guest@127.0.0.1:5672/%2F?connection_timeout=1000&heartbeat=100"
    MESSAGE_BROKER_DSN="enqueue://rabbitmq?queue[name]=heptaconnect"
    ```
