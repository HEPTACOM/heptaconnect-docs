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

- Extract fiddling of stuff into new class `\Heptacom\HeptaConnect\StuffFiddler`
```


### Add optional parameter to method of public API

This introduces new behaviours, so we also add a new feature:

```markdown
### Added

- Add optional parameter foobar in `\Heptacom\HeptaConnect\StuffFiddler::fiddle`
```


### Specialize component

When you have a generic component, that is not well optimized for certain cases, can be replaced with a new more optimized component:

```markdown
### Added

- Add class that can fiddle better with stuff of gizmos. Most usages of `\Heptacom\HeptaConnect\StuffFiddler::fiddle` can be replaced with `\Heptacom\HeptaConnect\GizmoStuffFiddler::fiddleGizmos` for better memory usage
```


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
