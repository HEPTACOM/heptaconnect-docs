# Upgrade integrations

Planning an integration does not just take now into consideration but also the future.
This guide will show you how to upgrade your integration into future versions of HEPTAconnect.


## Changelogs

Like every good software we provide publicly the changelogs for our open source packages as CHANGELOG.md next to the source code.
They are also included in this documentation.
See them in our [release overview](../../releases/index.md).
They are written to be understood by human and machines and follow the principles of the [keep a changelog proejct](https://keepachangelog.com/en/1.0.0/).


## Applying the changelogs

Your integration makes use of multiple HEPTAconnect packages at the same time, so you have to read and understand multiple changelogs.
This is a big task to overview the changes and apply them.
We can help you to upgrade your integration on multiple ways:

* You probably have a running project that has been made by us (HEPTACOM GmbH) or our partners.
  In that case we probably planned the update for your project already.
* Each entry in the change contains a technical information like a class name and a reason for the change.
  This way you can relate the technical information to your code and think about the change reason and apply it to your code.
* The technical information as previously mentioned is also written to be understood by a machine.
  You can save a lot of time using the `check:upgrade` command in the upcoming HEPTAconnect SDK.
  It will skim through your code and our changelogs to supply hints to you about the upcoming upgrade. 
