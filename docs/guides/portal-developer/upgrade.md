# Upgrade portals

When starting development of a portal it is always useful when using the latest version of the [portal base](https://github.com/HEPTACOM/heptaconnect-portal-base/) package. 
This guide will show you how to keep your portal up to the latest changes so you can profit from the new features.


## Changelogs

Like every good software we provide publicly the changelogs for our open source packages as [CHANGELOG.md](https://github.com/HEPTACOM/heptaconnect-portal-base/blob/master/CHANGELOG.md) next to the source code.
They are also included in this documentation.
See them in our [release overview](../../releases/index.md).
They are written to be understood by human and machines and follow the principles of the [keep a changelog proejct](https://keepachangelog.com/en/1.0.0/).


## Applying the changelogs

Your portal makes use of a few HEPTAconnect packages at the same time, so you have to read and understand multiple changelogs.
This is a big task to overview the changes and apply them.
We can help you to upgrade on multiple ways:

* Each entry in the change contains a technical information like a class name and a reason for the change.
  This way you can relate the technical information to your code and think about the change reason and apply it to your code.
* The technical information as previously mentioned is also written to be understood by a machine.
  You can save a lot of time using the `check:upgrade` command in the HEPTAconnect SDK.
  It will skim through your code and our changelogs to supply hints to you about the upcoming upgrade. 
