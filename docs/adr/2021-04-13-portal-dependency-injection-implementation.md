# 2021-04-13 - Portal dependency injection implementation

## Context

This is a follow-up to [the ADR about general service containers](./2020-12-10-portal-service-container.md).

Dependency injection is a common pattern to create reusable components that can build upon each other.
Portals will have to communicate with their API of choice in different flow components.
Presumably a portal developer wants to build an API client that can be used within all flow components.
This is where dependency injection comes in handy.
Depending on the implementation this can also be used to decorate services which will add more freedom for modifications.
We were able to provide a service container for each portal node matching [PSR-11](https://www.php-fig.org/psr/psr-11/) in the past, which allowed easy access to services but no injection into flow components.
There is the [PSR-11](https://www.php-fig.org/psr/psr-11/) standard to define a service container but not a service container builder and therefore there are no drop in implementations.


## Decision

* Use Symfony dependency injection
* Replace custom service container with Symfony
* Enable auto-wiring, auto-configuration, auto-binding and automatic PSR-4 resource loading
* Automatically load flow components and drop their definition from portals


## Consequences

### Pros

* Portal developers are most likely familiar with Symfony dependency injection
* Using service definitions based on xml or yaml do not require a tight composer dependency and can be used fluently with different Symfony versions
* Symfony's dependency injection has a very good documentation
* Symfony's dependency injection supports [tagged services](https://symfony.com/doc/current/service_container/tags.html)
* Symfony's auto-wiring, auto-configuration, auto-binding and resource auto-loading allows for zero-configuration dependency injection out of the box for portal developers


### Cons

* Portal developers need to know or learn Symfony dependency injection


## Related thoughts

We looked up [comparisons of different dependency injection implementations](https://kocsismate.github.io/php-di-container-benchmarks/benchmark.html) and evaluated those against the criteria:
* performance in building
* performance in usage
* the least friction against current and possible future dependencies

Symfony's implementation isn't the best in that comparison paper, but it allows for compilation and is well known in our context of work.
In the past we also saw very frictionless migrations between the Symfony versions using service definitions that are based upon xml and yaml.
