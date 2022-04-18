# 2022-01-05 - Code documentation

## Context

Code often needs documentation.
Not every code is self-explanatory without documentation.
In most cases this is due to code separation by [interfaces and contracts](./2020-04-30-contracts-and-interfaces.md) from their implementation that is used in e.g. strategy patterns.
Code documentation online is often easy to query due to use of search engines.
Code documentation online is not easy to separate by code version for neither the ones writing documentation nor the ones looking for documentation.
Any documentation can easily be forgotten to be updated.


## Decision

In our ticket refinement process we state right away which parts of the online documentation are likely to be affected and need to be checked.
We add documentation at source code level.
We add expectations to interfaces and contracts to reach API providers and API consumers.


## Consequences

### Pros

* Online documentation is likely to be up-to-date with every release to match its content
* Developers can make use of IDE features like tooltips or symbol navigation to read documentation right away
