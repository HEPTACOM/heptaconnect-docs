# Contribute to HEPTAconnect packages

If you want to contribute to HEPTAconnect, you can use the Playground as a starting point.
Start by running these commands.

```sh
composer config 'preferred-install.heptacom/heptaconnect-*' source
composer require 'heptacom/heptaconnect-framework:^0.9'
```

Composer will now install the Framework into `<project-dir>/vendor/heptacom/heptaconnect-framework`.
Additionally, composer will use git to clone the dependency from source.
This means, you can modify the source code directly in your `vendor` directory and try it in your integration.
When you are done, you can commit directly in this directory and prepare a pull request for us.
