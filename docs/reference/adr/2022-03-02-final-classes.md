# 2022-03-02 - Final classes

## Context

During development, we noticed that autocompletion suggested to extend from implementations that were not meant to be extended and result in confusion for API beginners.
This is a signal for bad developer experience.
In discussions with Macro "Ocramius", who is a well known defensive programmer, we took advise from him [to use `final`](https://ocramius.github.io/extremely-defensive-php/#/90). 
With that you will notice the `final` keyword more often, when e.g. using PSR-7 implementation from Tobias Nyholm `nyholm/psr7`, final has been recently [shifted to a PHP doc comment](https://github.com/Nyholm/psr7/blob/1.5.0/doc/final.md).  


## Decision

We add `final` keyword to everything, when it is not breaking extensibility.
As most of our solutions are based on strategy patterns and have [contracts and interfaces](2020-04-30-contracts-and-interfaces.md), we can rely on these to define our API without exposing the implementations.
We prefer the keyword over the PHP doc comment as the keyword is already present on language level without further extensions needed.
DTOs may also be final when they implement the `Heptacom\HeptaConnect\Dataset\Base\Contract\AttachmentAwareInterface`.


## Consequences

We need to evaluate every class to be final.
To support this we provide an internal phpstan test case and pay attention to its hints.


### Pros

* We can be sure our implementations are not reused, when we don't expect it
* We have more contracts and interfaces to keep flexibility and extensibility


### Cons

* We can not mock every implementation anymore and might need to rewrite implementations
* We can not have implementations depending on each other by inheritance like we do at a few spots
