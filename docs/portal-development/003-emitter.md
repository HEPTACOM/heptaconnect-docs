# Emitter

|             |       |
| ----------- | ----- |
| Introduced  | 1.0.0 |
| Deprecated  | -     |
| Removed     | -     |
| Replacement | -     |

An emitter's job is to read data from its portal's data source, convert it into a data set entity and hand that entity over to HEPTAconnect.

# Intention

When an object from a data source is published to HEPTAconnect, a mapping will be created (if it doesn't exist yet). A publication also sends a message to the job queue telling HEPTAconnect to emit the object. This approach has the benefit (as opposed to direct transfer) that publications can be done quickly and don't take up a lot of computing time. This enables publications during time critical processes like e.g. a web request.

The actual reading of data is handled by a consumer process of the job queue, while the publication can have various origins.