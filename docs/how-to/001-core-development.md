# How to be a HEPTAconnect developer

This is all about setting up a development environment to work on HEPTAconnect projects.

## Technical requirements

* PHP 7.4 or above
* Composer 1.8 or above

## Used tools, technologies and techniques

Adding static type hints with psalm and phpstan helps us to provide safe and more comprehensive code.
Using these tools adds generics and class string functionalities that helps understanding code without an execution context.

Developing on the maintainer side is mainly done in JetBrains PHPStorm but is not limited to it.
You are free to use any IDE or text editor although the developer experience is improved on the usage of PHPStorm.

Tests and their coverages are ensured using pest (phpunit) unit tests and code mutators to improve testing quality.

HEPTAconnect aims to be working at bleeding edge technology and supporting the latest stable versions.
To achieve this the composer requirements are only setup with a lower bound to allow the easy usage of latest releases.

By the growth of the HEPTAconnect community and connected APIs we look out for easy ways to support developers to allow their projects run steadily and non-breaking while the core runtimes get improved and extended by time.
One of these ways are fallback implementations.
A fallback class always implements an interface completely in a way that makes the code at least be valid in a php code runtime.
When you use these fallback classes we can support your extension without breaking it.

Message brokers and asynchronous messaging allows HEPTAconnect to be just a little impact on the performance of the main application that provides the bridge.
In addition asynchronous messaging allows for a scalable increase of reactivity and flexibility.
