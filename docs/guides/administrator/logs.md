# Logs

Log messages are the most detailed way to get into the actions that happen in the HEPTAconnect instance at close to real time.
Only debugging into it provides more details.
Watch the following sources for changes and get informed about the most detail info you can get.


## Locations

When the development team [integrated a non-standard logging facility](../integrator/logging.md) there are probably setup notes about it.
Otherwise, the [bridge](../integrator/bridges.md) logging fallback takes action, logs into files and the following paragraphs apply.


### Files

File logs contain the most different message types and should be the first choice of investigation.
The log file locations may vary as they depend on the integration your instance uses.
Common locations to check:

```
<system-root>
├── <instance-dir>
│   ├── var
│   │   └── log
│   │       └── heptacom_heptaconnect_*.log
│   └── storage
│       └── logs
│           └── heptacom_heptaconnect_*.log
└── var
    └── log
        └── application
            └── heptacom_heptaconnect_*.log
```


### Database

HEPTAconnect provides an entity-centered database table to store entity related exceptions.
You can find it in your instance database by the name `heptaconnect_mapping_error_message`.
It is used to store error messages that can be connected to certain items.


## Contents

### Files

Log files contain timestamps, log level, component names (e.g. EmitterStackBuilder, ExplorationActor), messages and unique codes.
Depending on the message you have additional context like primary keys.
When a log message is issued from a portal the message is prefix with the portal node key (aliases are supported).
Unique log message are part of the error origin finding process.
You can read more in a [news entry](/news/2022-05-17-exception-and-log-message-codes/) and [this ADR](../../reference/adr/2021-09-06-exception-and-log-message-codes.md) about it.


### Database

The database table contains timestamps, portal node keys, mapping node keys, message, exception type, exception stacktrace for a complete exception stack.
As the database table only contains exceptions there is no need of a log level.
