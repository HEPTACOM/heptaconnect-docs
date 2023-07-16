# 2020-08-10 - Architecture decision records

## Context

We document architecture and technical decisions for HEPTAconnect.
Inspired by https://github.com/shopware/platform/ we follow the same principles and use ADRs to keep track of decision making to make it easier to understand why things are how they are:

* [A Simple but Powerful Tool to Record Your Architectural Decisions](https://medium.com/better-programming/here-is-a-simple-yet-powerful-tool-to-record-your-architectural-decisions-5fb31367a7da)
* [Documenting Architecture Decisions](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions)
* [When should I write an Architecture Decision Record](https://engineering.atspotify.com/2020/04/14/when-should-i-write-an-architecture-decision-record/)

## Decision

Having the ADRs as part of the versioning adds more pros:

*  Decisions remain in sync with the code itself
*  The Git history is also the decision history
*  Decisions are public available and accessible for every developer
*  Also external developers can add new ADRs via GitHub pull requests

## Consequences

Every architectural change or addition should contain a Markdown file like this to have a brief understanding what are the pros, cons and how it should be used.
Until the release of version 1.0.0 it is ok to add ADRs for decisions made in the past.
This is the reason why you probably find ADRs with a timestamp before we decided to add ADRs.

ADRs have to approved by a maintainer when they are proposed by a contributor.
As a past ADR can't be changed it has to be marked as deprecated by copying it into the deprecated folder, change the original file to link to the copy and refer to the new superseeding ADR.

## How does an ADR look like?  

You can use this first ADR as an orientation.
The filename of the ADR should contain the date and a meaningful title.
The content of the ADR should always use the following template:

```
# [Date] - [Title]
## Context
## Decision
## Consequences
### Pros
### Cons
### How to use
## Related thoughts
```
