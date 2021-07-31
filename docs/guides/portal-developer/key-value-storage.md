# Key-Value-Storage

|             |       |
| ----------- | ----- |
| Introduced  | 1.0.0 |
| Deprecated  | -     |
| Removed     | -     |
| Replacement | -     |

The Key-Value-Storage is a storage component designed for portals to have a simple storage mechanism restricted to a specific portal node.
The intention is to provide a storage abstraction for [morphers](./morphers.md) to store intermediate object data.
However, a regular portal may utilize the Key-Value-Storage as well.

## Intention

The intended way to use the Key-Value-Storage is for a morpher to persist intermediate object data for later useage.
The contract exposes a getter and a setter method and the and keys are unique for a portal node.
A key can be any string of up to 255 characters.

A morpher's receiver could receive an object and store it in the Key-Value-Storage.
The same morpher's emitter could later retrieve the object from the Key-Value-Storage and combine it with some other data.
However, since a morpher is just a portal with a certain role to it, every regular portal may utilize the Key-Value-Storage as well.

## Usage

Because the Key-Value-Storage is restricted to a portal node, it is contextual to a run.
That is why it can be retrieved from the context of an explorer, an emitter or a receiver.

A portal can get or set any data to the Key-Value-Storage.
Depending on the capabilities of the storage it is even possible to store files in it by wrapping the file contents in the corresponding struct class.

## Error handling

In theory an implementation of the Key-Value-Storage should be able to handle any kind of data.
In practise though, whether a certain set of data can be stored depends on the available storage strategies.
Providing these strategies is the responsibility of the storage, so a portal cannot influence these.
If a portal tries to store a value that cannot be handled by any available strategy, the Key-Value-Storage will throw an exception.
Similarly, if a portal tried to read a value that cannot be handled by any strategy (maybe the corresponding denormalizer has been removed with a recent update), the Key-Value-Storage will throw an exception as well.
