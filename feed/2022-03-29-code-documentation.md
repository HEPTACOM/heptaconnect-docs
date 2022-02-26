{
    "date": "2022-03-29",
    "title": "Documentation at source code level",
    "summary": "Providing documentation on a point that is quickly reached",
    "author": "Joshua Behrens"
}
---

## TL;DR

- Easy queryable documentation within source code
- Documentation on interfaces and contracts

With the release of 0.9 we started to document every interface and contract.
This way we ensure clear communication how to use the interface as an API user and as an API implementer.

Adding documentation on source code is a delicate discussion topic in most developer conversations.
We evaluated our experience with other documentations and were (and still are) really happy with the approach of the PSR composer packages.
When looking at e.g. the `\Psr\Log\LoggerInterface`, there is a common description at the interface and a short hint on every method.
In everyday usage it was nice to use a logger instance, navigate to the interface symbol or one of the methods and see right away how the intended use is.
A similar pattern can be seen in the documentation stubs PHPStorm ships for native PHP functions.
This kept the developer in the IDE without losing their focus.

We see the possibility that these comments may go out of date.
To prevent this from happening too often, we decided to only write expected usage and possible implementation hints.
With this rule of thumb we are not fixed to a certain implementation that may change over time.
Instead, we use the intended use case as comment when the component was introduced so every shares the same expectation.
