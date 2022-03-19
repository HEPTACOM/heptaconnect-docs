# 2021-08-24 - PHP 8.0 named arguments

## Context

At one point the [old RFC for named arguments](https://wiki.php.net/rfc/named_params) got an update, has been approved and implemented.
With the implementation of this feature a language aspect changes how public API is perceived.
When using PHP >=8.0 function arguments are not just positional but also associative and keyed by their name depending on the callers function calling behaviour.


## Decision

We do not support this feature and claim the argument names as private API.
This includes to wrap calls for `func_get_arguments` in an `array_values` or similar approaches to remove names from parameters.
This feature can be replicated to a certain degree with parameter classes the only contain the data for a method call in a single object, and therefore is not a language feature we depend on.
We already use this occasionally with a trend towards this.
This allows setting parameters by name via using their respective setter.
It also has the same developer experience across PHP versions.


## Consequences

### Pros

* Contributors to HEPTAconnect packages have one breaking change complexity layer less to work on
* Contributors to HEPTAconnect packages can apply the same backward compatibility promises across all supported PHP versions (which includes versions prior to this feature)
* Contributors to HEPTAconnect packages are allowed to rename parameters


### Cons

* Users of HEPTAconnect packages can make use of this feature, but they should implement a test that targets this feature to ensure functionality using HEPTAconnect defined private API.
* HEPTAconnect can be evaluated as non-fully PHP 8 compatible
