# Cronjob

|             |       |
| ----------- | ----- |
| Introduced  | 1.0.0 |
| Deprecated  | -     |
| Removed     | -     |
| Replacement | -     |

The preferred way to keep data of different portals synchronized is [Transfer-on-Demand](#) as it provides minimal latency. However, this requires external systems to proactively notify HEPTAconnect whenever data is modified. This may not always be possible, e.g. when a platform provider does not support webhooks or the data source is a static file on an FTP-Server. In these situations a portal may use [Transfer-on-Polling](#) by utilizing cronjobs.

## Intention

Cronjobs are designed to enable Transfer-on-Polling for data sources that cannot notify HEPTAconnect of changes on its own. A cronjob execution is therefore similar to an [exploration](./002-explorer.md) as their primary purpose is to [issue a publication](#).

## Usage

A cronjob must be registered by using the cronjob service that can be retrieved via the service discovery. The cronjob service's contract exposes a method to register a cronjob handler and to specify the desired timing in crontab notation. HEPTAconnect will then call the cronjob handler whenever the timing matches.

A typical cronjob handler could connect to the data source of its portal node, iterate through it ans publish any object it sees fit. To be able to establish a connection to the data source, a context object is provided for the cronjob handler (similarly to the context of an exploration, an emission or a reception). This context (among other things) holds the configuration of the corresponding portal node.
