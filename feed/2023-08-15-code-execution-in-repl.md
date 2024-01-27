{
    "date": "2023-08-15",
    "title": "Code execution in REPL",
    "summary": "Development and production intervention sometimes need a REPL",
    "author": "Joshua Behrens"
}
---

## TL;DR

- REPLs allow code execution without prior writing and deployment
- [psysh](https://psysh.org/) is a ready to use REPL for PHP
- Once you `composer require psysh` you can use `heptaconnect:repl`, which integrates psysh into HEPTAconnect


## What is a REPL?

REPL stands for Read-Eval-Print-Loop.
It is a common pattern in programming languages to provide a way to execute code without prior writing and deployment.
You are likely familiar with this pattern from the browser console or the `php -a`/`php --interactive` command.
The `php -a` command is a REPL for PHP, that is shipped with the PHP interpreter itself.
Try it out yourself by simply typing `php -a` into your terminal and execute a command like `var_dump(new DateTime())`.
It will print the current date and time.
The execution did not stop though.
You can execute multiple commands in a row now by entering a new command.
This is where the loop comes in.
It will keep executing commands until you exit the REPL by typing `exit` or pressing `Ctrl+D`.


## What is psysh?

The php interactive mode is a very simple REPL, that does not provide any additional features you are used to from IDEs or other development tools.
[psysh](https://psysh.org/) is a REPL for PHP written in PHP itself and shipped as a standalone package, that can be used as a replacement for `php --interactive`.
In comparison, it is a very powerful REPL, that provides a lot of features, that you know from your IDE.
You can look up code behind classes, read documentation, autocomplete code and much more.
It is really versatile and that is why we integrated it into HEPTAconnect.


## How to use psysh with HEPTAconnect?

Once you `composer require psysh` you can use the `heptaconnect:repl` command, which integrates psysh into HEPTAconnect.
It will automatically load a portal node container of your choice and provide you with a REPL, that is already configured to work with that specific portal node.

As example you can paste the following code into the REPL and execute it:

```php
service(\Psr\Log\LoggerInterface::class)->info('Hello World');
```

This will log the message `Hello World` to the portal node specific logger.
You can access any service out of the portal node container and execute any code you want.
