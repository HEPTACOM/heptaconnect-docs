# 2022-06-12 - Type safe class strings

## Context

PHP and the PHP community are striving further towards static analysis.
More and more tools arise next to the movement of the [php-src](https://github.com/php/php-src) developers adding language features to improve type safe programming.
Tools like [phpstan](https://phpstan.org/) and [psalm](https://psalm.dev/) add [PHPDoc comments](https://github.com/php-fig/fig-standards/blob/a1a0674a742c9d07c5dd450209fb33b115ee7b40/proposed/phpdoc.md) based features like type templating/generics.
There are also typed class strings.
One can add comments to basic strings and indicate that these strings are references to fully-qualified class names.
We make use of this class-string feature as we have references for types at several places.
For example: we reference the types of entities to store data transfer relations between portal nodes.
The only issue is, that this class-string feature is solely powered by PHPDoc comments.
There are no validations during runtime.
Without these validations the code is only valid in theory but can fail at real life usage.
Real life usage includes scenarios like references to classes that do not exist anymore due to refactoring.

## Decision

We need validation at runtime.
Therefore, we need a replacement for class-string type hints.
Although string is a very simple type, we will add a complex meaning to it.
To have similar features at runtime like we have during static analysis, we need multiple classes.
The following features must be implemented:

- Strings encapsulated in objects must behave like before and keep their original initial value
- Valid references mean, that the referenced class can be loaded
- String objects, that reference a class, do not necessarily have to reference an existing class
- String objects, that reference a class and claim to be valid, must perform validation on creation so its usage always ensures a valid reference
- String objects, that reference a class and claim to be of a certain type, must perform validation on creation so its usage always ensures a valid reference


## Consequences

With different string validations at hand, various classes will follow different expectations towards validation of class strings.
Loading data from the storage layer must assume invalid historical data and therefore must not invoke validation when loading the data.
In contrast, business logic, that expects certain classes to be available for further processing, may use more strictly validating string classes.


### Pros

- Class string references can now be validated at runtime


### Cons

- More decisions have to be made, when to use which degree of validation
