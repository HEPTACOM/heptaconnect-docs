# Morpher

A morpher is basically an implementation of a portal that does not directly interact with an external data source but instead acts as a conversion or aggregation mechanism.
Its purpose is to receive data from one or multiple portals and emit them in some other form for another portal.

## Intention

Morphers are multi-purpose-utilities when it comes to moving data from one portal to another while modifying it on the fly.
A simple example could be the following use-case:

Say you have an ecommerce portal that emits orders and customers.
You also have a customer support portal that can receive support tickets.
The goal is to convert orders and their respective customers into support tickets.
You cannot configure a route from your ecommerce portal directly to your customer support portal, because they do not support the same data types and also you have to combine an order with a customer to have enough information for a support ticket.

Your morpher would have two receivers.
One for orders and one for customers.
Both of them store their received objects in the Key-Value-Storage.
The order receiver will publish a support ticket object whenever it saves an order to the Key-Value-Storage.

The morpher also has an emitter supporting those support ticket objects.
It will load an order from the Key-Value-Storage and (using the customer-id from said order object) it will then try to load a customer from the Key-Value-Storage.
If a customer is found, all the necessary informations are present and can be converted to a new support ticket object which is then emitted.
If the customer cannot be found, the order is re-published, so the emitter can try again later.

## Usage

While the example above is the most common way to use a morpher, it is by far not the only way.
A morpher is technically indistinguishable from an ordinary portal.
It is its unique role as an intermediate portal that makes it a morpher.
Because of that, there are numerous possibilities for what a morpher can do and it almost certainly comes down to an individual use-case.

Here are some examples for what a morpher could potentially do.

- Convert one data type to another one.
- Combine multiple objects into a single new one, even when the original objects are emitted at different times.
- Measure the throughput between two portals by logging every transfer.
- Throttling the throughput between two portals to comply with API rate limits.
