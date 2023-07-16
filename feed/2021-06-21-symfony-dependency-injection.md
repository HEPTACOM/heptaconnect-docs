{
    "date": "2021-06-21",
    "title": "Symfony dependency injection for portal developers",
    "summary": "Integrating a well known dependency injection container provides lots of cool features",
    "author": "Joshua Behrens"
}
---

## TL;DR

Write less. \
Achieve more in less time. \
Look at your results faster.

Read more about [Dependency injection](https://heptaconnect.io/guides/portal-developer/dependency-injection/) and the new [default utilities](https://heptaconnect.io/guides/portal-developer/default-utilities/).


## Preamble

One of our main goals for HEPTAconnect is the ability to replace lots of different implementations to gain a frictionless integrability.
When we were looking for the service container feature, we had an issue to solve:
As service container builders have not been addressed in the [PSR-11](https://www.php-fig.org/psr/psr-11/), we had to implement service container and builder.
The custom implementation holds a 47 lines-of-code container implementation, a 36 lines-of-code container builder and a single entry point for portal developers in their code.


## What we achieved

We were able to get yet another PSR compatibility and its benefits: build and share reusable components.
By now our implementation of a service container is about half a year old, and we are missing features.
We didn't expect our small implementation to have it all right away, but it is a bit impractical in daily usage.

* Tagged services are missing
* Every service had to have a service definition
* Service decoration was possible but very unpleasant
* Services could only be pulled out of the container

It served the purpose, but it wasn't quite right.


## What we were looking for

Basically we were looking for what we were missing:

* Tagged services
* Write no boilerplate service definitions (in the best case)
* Easy service decoration
* Dependency injection (instead of pulling)

We were accustomed to the Symfony and Laravel worlds having all these features.
Laravel didn't make the cut for us as it is difficult to pull Illuminate components out of their ecosystem.
Symfony gave us similar expectations back when we noticed Bundles are part of the HttpKernel and also quite baked into the Symfony framework `/rant`.


## The future is now

On our search for a good implementation for service containers with dependency injection we stumbled upon [a benchmark](https://kocsismate.github.io/php-di-container-benchmarks/benchmark.html).
The Symfony implementation was most of the time in second place but had all we ever wanted.
So we revisited that package and were happy to see that it had barely any dependencies which is good for an almost frictionless package.
Having the service definition files based on xml and yml also allows portal developers to define services without knowing the exact Symfony version behind the scenes.

We gave the implementation a try and got hooked right back into it.
Enabling all the nice things and sprinkling some more educated guesses into the container builder gave us the shiny new developer experience for portal developers we always wanted to provide:

* Even in bigger scenarios there is no definition file needed as we are using the composer.json of the portal for prototyping definitions
* Auto-wiring allows for smart service injection guesses
* Auto-configuration allows for smart service kind detection
* Integrations are now able to alter the containers almost effortlessly
* Flow components (explorer, emitter, receivers) and status reporters can make use of dependency injection
* Portal developers are most likely from a Laravel or Symfony background and should be already quite familiar with the logic behind the scenes


## Documentation

When you already had a deeper look into our documentation, you can notice the reduction of boilerplate code in almost every portal developer code sample.
We added [a new chapter](https://heptaconnect.io/guides/portal-developer/dependency-injection/) to the documentation under portal development containing everything you need to know to use dependency injection with the new service container.
This way we also took the chance to provide a [complete list of utility service](https://heptaconnect.io/guides/portal-developer/default-utilities/) we provide out of the box.
