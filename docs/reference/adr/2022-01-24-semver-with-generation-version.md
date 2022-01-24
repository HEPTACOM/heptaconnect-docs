# 2022-01-24 - SemVer with generation version

## Context

We follow [semantic versioning](https://semver.org/) to label our releases with expectations for its users, when upgrading.
At point of writing updating from a major version includes upgrade options.
There can be a time in the future, where this upgrading option is not applicable anymore or at a certain complexity level, that is above the current upgrade expectations.
Can we put this expectation in semver?


## Decision

Yes, we can.
The further we go right in a semver version string one expect issues in an upgrade.
The first number is already allowed to include breaking changes.
Increments in the first place are therefore expecting breaks.
When we add a number on the left side similar expectations are readable from semver although we do not comply completely with semver anymore.
We call this first number "generation" as a follow-up/next generation is allowed to be non-compatible with its ancestors as it evolves.


## Consequences

Releases need to have a rating to explain our expectations like increments in second place is still a major breaking change.


### Pros

* Users have additional release information, which simplifies risk management on planning an upgrade
* HEPTAconnect is allowed to evolve into HEPTAconnect 2 or 3 while keeping the brand and project name without creating technical ambiguities


### Cons

* Users can misread version string
* Releases need to have additional information
