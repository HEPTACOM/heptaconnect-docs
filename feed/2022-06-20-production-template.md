{
    "date": "2022-06-20",
    "title": "New repository: HEPTAconnect production template",
    "summary": "Kickstart your new HEPTAconnect integration projects",
    "author": "Julian Krzefski"
}
---

## TL;DR

- New repository: Production template
- Kickstart your own projects
- More documentation coming soon™

## Template repository for production-ready integrations

HEPTAconnect is (at its core) completely framework-agnostic.
That means, it can virtually be integrated into any kind of PHP-based application.
This approach makes HEPTAconnect highly versatile, but it also requires integrating HEPTAconnect into an application to provide a runtime environment.

We aim to make setting up HEPTAconnect projects as simple as possible, so we created a template repository to kickstart your projects.
This repository is designed to be forked and then adjusted to your requirements.
Here you can check out our [HEPTAconnect production template repository](https://github.com/HEPTACOM/heptaconnect-production) on GitHub and fork it yourself.
You can also use `composer create-project` to start your new project.

```sh
composer create-project heptaconnect/production my-project -s dev
```

At this point you should take a look at the [`README.md`](https://github.com/HEPTACOM/heptaconnect-production/blob/master/README.md) file.
There you will find a quick introduction and useful first steps.

This repository template is our recommendation to create new projects with HEPTAconnect.
We will continue to maintain it to stay up to date with the latest HEPTAconnect releases.
We also use this repository internally to kickstart our own HEPTAconnect integrations.

## Future

Currently, the production template depends on `shopware/core` for some dev-ops utilities and uses it as runtime environment for HEPTAconnect.
While this is not really a problem, we aim to be fully independent from `shopware/core` to trim down on our required composer packages.
We have that planned for version 0.10 of HEPTAconnect.

Furthermore, we plan to release more documentation content about the production template.
As of now, the `README.md` file inside the repository is the only documentation for it.
More detailed documentation that covers more use cases will follow soon™ in the [Integrator section on the HEPTAconnect documentation website](https://heptaconnect.io/guides/integrator/).
