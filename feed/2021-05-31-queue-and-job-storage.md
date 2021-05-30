{
    "date": "2021-05-31",
    "title": "Queue and job memory utilization reduction up to 95%",
    "summary": "Switching to dedicated job storages reduced the memory utilization and improves job management",
    "author": "Joshua Behrens"
}
---

This week we completed our [ADR about jobs](https://connect.heptacom.de/#/adr/2020-10-30-job-messages-and-payload.md).
Working on that issue really created lots of space for further tasks in the architecture of HEPTAconnect as well as on the storage layer used for the message broker. 

In detail, we've been using the message broker to completely keep the data in question for each transfer.
Read our [ADR about jobs and their payloads](https://connect.heptacom.de/#/adr/2020-10-30-job-messages-and-payload.md) to follow our thoughts but here are the basic pros:

* When emptying a message queue, the messages can be reconstructed
* The message provider has fewer data to store
* It is easy to change job types and payload structures

We were testing the storage sizes on a default Shopware 6 setup.
It uses php serialization to store messages on the database.
After our change we only store a job reference in the message and store the payload on the database.
Our referenced payload takes up from 40% to 95% less memory on the same database driver than in the message table.
The following tasks benefit from the size difference:

* database query times
* database backup sizes
* message broking on various providers
* restoring and duplicating systems

Above mentioned the architecture also draws a big benefit from that change:
As we now have the job payloads separated from their execution scheduling, it is easier to add reference between these jobs.
This is especially useful for [SAT](https://en.wikipedia.org/wiki/Boolean_satisfiability_problem) algorithms that will make their way into HEPTAconnect one day.
