{
    "date": "2022-05-17",
    "title": "Exception and log messages in action",
    "summary": "First-responders looking into logging facilities will love these",
    "author": "Joshua Behrens"
}
---

## TL;DR

- Log messages and exceptions have unique codes
- Documentation explains these codes
- These are not correlation identifiers


## Unique codes

Since the version of 0.8 we add unique codes to exceptions and log messages.
The full explanation can be read in [this ADR](https://heptaconnect.io/reference/adr/2021-09-06-exception-and-log-message-codes/).

In short: these unique codes are quickly looked out for.
Either online in our documentation or your IDE.
They describe a point in the source code and keeps consistent in meaning even after an update.


## Documenting the codes

Although we use the unique codes for log messages and exceptions, you will likely only look them up because you are a first-responder to an issue of your system.
So whenever you get a code from your log message's metadata you can just look them up in the search of our documentation.
In general, you get a single hit within changelogs when the code has been introduced.
There can be more hits, when the code has been moved to a different place or removed.
In this scenario you can match by your installed HEPTAconnect version to find your issue.
As these codes are part of our public API and are in the changelogs, you will find a [technical reference and a human-readable meaning](https://heptaconnect.io/news/2022-01-11-changelogs/) to it.

The real life scenario could now be something like this:

When there is the exception code 123 in your logs, and you find this message in the changelogs:

> Add code `123` in `\Heptacom\HeptaConnect\TechnicalReference::doSomething` when JSON configuration file is invalid JSON.

And someone recently edited a JSON file, you can combine these hints and find a solution on your own.
As the changelogs are shipped with the code, you can also find this hint with a `grep` call in your installation.
When you search the files, you will also find that single piece of code that triggered the exception right away.

This will make first-responders more helpful and independent.


## Correlation identifiers

When we talk about codes in log messages, we should point out that these are not correlation identifiers.
Correlation identifiers could only be queried in the HEPTAconnect installation as they identify a single situation like a specific web request or a job run.

To keep posted with our news, that will definitely contain information on correlation ids once they are released, subscribe our feeds: 

* [RSS](https://heptaconnect.io/news/rss2.xml)
* [Atom](https://heptaconnect.io/news/atom1.xml)
* [JSON](https://heptaconnect.io/news/json1.json)

Or follow us on [Twitter](https://twitter.com/heptacom_gmbh).
