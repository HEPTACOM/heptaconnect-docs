# Writing changelogs

## Motivation

Working in the past with different frameworks and libraries we experienced it was to a certain degree easy to integrate into projects.
In most cases it was much more difficult to keep the dependencies updated properly compared to introducing them.
This is something we want to be different.
In our fast-paced world of changes we need to also look out for these qualities.


## Structure

The changelog file in the root of the package has a preface for the rules inside the changelog file.
We follow the format of the [keep a changelog project](https://keepachangelog.com/en/1.0.0/) with [semantic versioning](https://semver.org/spec/v2.0.0.html) which formats the file in a standardized layout.

For every version we will have changes listed.
It is allowed to release a package without a change to properly release a group of interdependent packages so an empty section is fine.
There is always a version entry called `Unreleased` to collect new entries up to the release of the upcoming version.

The logs of each version are grouped into their classification of additions, changes, deprecations, removals, fixes and security fixes.
To ensure a better understanding of the change the logs are focussed on features of the package written in present tense.
Each log has to contain a technical reference to look up usages of the feature.


## Examples

Depending on the change we can form scenarios into changelogs.
When you are unsure what to write you can find some sample texts below:


### Extract code of private API into code of public API

This introduces a feature, so we should write something like:

```markdown
### Added

- Introduce fiddling of stuff into new class `\Heptacom\HeptaConnect\StuffFiddler`
```

As seen in version 0.8.0 of heptaconnect-core:

> **Added**
>
> - Extract path building from `\Heptacom\HeptaConnect\Core\Storage\Normalizer\StreamNormalizer` and `\Heptacom\HeptaConnect\Core\Storage\Normalizer\StreamDenormalizer` into new service `\Heptacom\HeptaConnect\Core\Storage\Contract\StreamPathContract`


### Add parameter to method of public API

This introduces new behaviours, so we also add a new feature:

```markdown
### Added

- Add optional parameter `$foobar` in `\Heptacom\HeptaConnect\StuffFiddler::fiddle`
```

As seen in version 0.7.0 of heptaconnect-core:

> **Added**
>
> - Add parameter for `\Psr\Log\LoggerInterface` dependency in `\Heptacom\HeptaConnect\Core\Portal\PortalStorage::__construct` and `\Heptacom\HeptaConnect\Core\Portal\PortalStorageFactory::__construct`


### Specialize component

When you have a generic component, that is not well optimized for certain cases, can be replaced with a new more optimized component:

```markdown
### Added

- Add class `\Heptacom\HeptaConnect\GizmoStuffFiddler` that can fiddle better with stuff of gizmos in terms of memory handling

### Removed

- Remove `\Heptacom\HeptaConnect\StuffFiddler::fiddle`. Use `\Heptacom\HeptaConnect\GizmoStuffFiddler::fiddleGizmos` instead
```

As seen in version 0.8.0 of heptaconnect-storage-base:

> **Added**
>
> - With storage restructure explained in [this ADR](https://heptaconnect.io/reference/adr/2021-09-25-optimized-storage-actions/) we add `\Heptacom\HeptaConnect\Storage\Base\Contract\Action\Route\Get\RouteGetActionInterface` for reading metadata of routes by the given `\Heptacom\HeptaConnect\Storage\Base\Contract\Action\Route\Get\RouteGetCriteria` to return a `\Heptacom\HeptaConnect\Storage\Base\Contract\Action\Route\Get\RouteGetResult`
>
> **Removed**
>
> - With storage restructure explained in [this ADR](https://heptaconnect.io/reference/adr/2021-09-25-optimized-storage-actions/) we remove implementation `\Heptacom\HeptaConnect\Storage\Base\Contract\Repository\RouteRepositoryContract::read` in favour of `\Heptacom\HeptaConnect\Storage\Base\Contract\Action\Route\Get\RouteGetActionInterface::get` that allows for optimizations in the storage implementation


### Upgrade composer dependency

Pre-checking composer upgrades is important to reveal changes of further application fine-tuning, so we mention them as well:

```markdown
### Changed

- Upgrade composer dependency `psr/log: ^1.0` to support future versions `psr/log: ^2.0`
```


### Fix a bug

The difficult part here is the differentiation between a security bugfix and an unexpected behaviour:

```markdown
### Fixed

- When passing foobaz into `\Heptacom\HeptaConnect\StuffFiddler::fiddle` did not pay respect to a GizmoStuff situation
```

As seen in version 0.7.0 of heptaconnect-portal-base:

> **Fixed**
>
> - `\Heptacom\HeptaConnect\Portal\Base\Support\Contract\DeepObjectIteratorContract::iterate` drops usage of `\spl_object_hash` to not break on garbage collection


### Add unique log code for lookups

When anything is logged or an exception is thrown a package-unique code should be generated.
Using a UNIX timestamp is handy as it is an integer and plays nicely with `\Throwable::getCode`.
These have to be documented in the changelogs as well to raise awareness and be the first contact point for persons in need of an explanation.

```markdown
### Added

- Add log exception code `123456789` to `\Heptacom\HeptaConnect\StuffFiddler::fiddle` when fiddling with stuff that is not allowed to access gizmos
```

As seen in version 0.8.0 of heptaconnect-core:

> **Added**
>
> - Add log exception code `1636503503` to `\Heptacom\HeptaConnect\Core\Job\Handler\ReceptionHandler::triggerReception` when job has no related route


### Rename classes or move classes between namespaces

When a code refactoring needs moving a class a plain `rename` or `move` hint should to be added to the changelog.
Additional explanation is optional but suggested as most refactoring have a good reasoning regarding functionality.

```markdown
### Changed

- Rename `\Heptacom\HeptaConnect\StuffFiddler` to `\Heptacom\HeptaConnect\StuffFiddlerHandler`
```

As seen in version 0.5.0 of heptaconnect-dataset-base:

> **Changed**
>
> - Rename `\Heptacom\HeptaConnect\Dataset\Base\Translatable\GenericTranslatable` to `\Heptacom\HeptaConnect\Dataset\Base\Translatable\AbstractTranslatable`
