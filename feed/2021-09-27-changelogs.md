{
    "date": "2021-09-27",
    "title": "Changelogs for safer and understandable updating",
    "summary": "Updating your project would be a mess without proper changelogs",
    "author": "Joshua Behrens"
}
---

## TL;DR

- Feature focussed changelogs
- Human-readable
- Machine-readable
- Guides for [portal developer](https://heptaconnect.io/guides/portal-developer/upgrade/) and [integrator](https://heptaconnect.io/guides/integrator/upgrade/).

With the new version release of 0.7 we start to add changelogs.
These are important news and therefore reside in our [news section](https://heptaconnect.io/releases/).
There you can find a human-readable and easy to browse version of the changelogs.
So with each upcoming release of HEPTAconnect you should check out the documentation about the new changes and get excited.

## Why is that important to me?

Updating to the most recent version of HEPTAconnect is always a combination of:

- Oh, something new I want to use to write less code in the future
- Oh, something new I can adapt to improve performance or flexibility
- Oh, something broke, and I should check my tuned application as well

So you can check your version of HEPTAconnect using `$ composer show heptacom/heptaconnect-\*`, understand the news and compare.

## How do I understand?

That is super easy as we write them in a non code-exclusive focussed view to explain the changes of the public API.
We are focussing on feature based logs so the generic changes of a `git diff` turns into a human understandable view on the change.
The [keep a changelog project](https://keepachangelog.com/en/1.0.0/) thinks alike, therefore we follow its guidelines for a good changelog.
To summarize: Every version has a clear title with a [semantic version](https://semver.org/spec/v2.0.0.html) and the release date.
Each version has a section filled changes grouped by their classification of additions, changes, deprecations, removals, fixes and security fixes.

Looking at the changelog lines you will see they always reveal quite technical information.
We add them to the messages to visualize a clear connection of features to code components.
It makes it easy to research for unique code components and understand why they have been changed.
When we do package internal changes you won't see them as they probably won't bother you.
Don't worry though, when we change e.g. database interactions this is often considered an internal change but still resides under the changes classification for e.g. resources usage reasons.

## How do I compare?

You have to take every log and look up whether it affects your code changes as every log should contain enough technical reference.
When you have a match you can understand the connected feature and apply the knowledge.

The process sounds correct but tedious, right?
We thought so as well, so we decided to snoop around one step ahead again and had a look on how to automate this, so we all have less to do again.

## How do I upgrade my code?

So we like our code a bit magical but still reasonable.
As we do it ourselves, we are aware how people can turn PHP into anything.
Therefore, we can't provide an automatic upgrade yet, but we are working on a tool which either supports or fixes code automatically for you.
We prepared guides to do upgrades for [portal developers](https://heptaconnect.io/guides/portal-developer/upgrade/) and [integrators](https://heptaconnect.io/guides/integrator/upgrade/) as well for [contributors](https://heptaconnect.io/guides/contributor/changelog/) which we will both upgrade regularly.
