{
    "date": "2023-02-14",
    "title": "HTTP middlewares for clients and servers",
    "summary": "Interception points for HTTP requests and responses in every direction",
    "author": "Joshua Behrens"
}
---

## TL;DR

- Support for PSR-15 middlewares for HTTP handlers
- PSR-15 is not enough, so we add HTTP middlewares for HTTP clients as well


## HTTP handlers

With HTTP handlers we already solved different challenges in the past:

* We built visual setup wizards, which are able to handle OAuth2 authorization flows.
* We built development tools, which we reuse in our own projects.
* We react to webhooks and we build a lot of other stuff.

So many use cases, where we could use an abstraction layer to share common code efficiently. 
Good news: [`PSR-15`](https://www.php-fig.org/psr/psr-15/) solves this problem conceptually.

With 0.9.2 we added support for PSR-15 middlewares for HTTP handlers.
This means, you can add middlewares to your portal, which are automatically applied to all inbound HTTP requests and responses.
Using this very powerful concept allows you to add custom logic like authorization, logging, caching, etc. to your portal.


## HTTP clients

PSR-15 is unfortunately not made for HTTP clients.
The PSR-7 HTTP client can already have shared common code with the use of decorators, which are very similar to PSR-15 middlewares.
Using these decorators is a good and known strategy but it is not as easy to use as the automatically applied PSR-15 middlewares. 
Therefore, we created our own middleware interface for HTTP clients, that is similar to PSR-15 middleware specification.


These two middleware interfaces will support you to build your own helpful tools for your project.
Have a look at the documentation pages for the [PSR-15 middleware interface](https://heptaconnect.io/guides/portal-developer/http-handler-middleware/) and the [HTTP client middleware interface](https://heptaconnect.io/guides/portal-developer/http-client-middleware/) to learn more about the interfaces and how to use them.
