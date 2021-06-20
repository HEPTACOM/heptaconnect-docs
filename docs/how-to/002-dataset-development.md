# How to be a HEPTAconnect dataset developer

This is all about the guidelines to structure a dataset.
Be sure to know then general thoughts and requirements to be a [HEPTAconnect developer](./001-core-development.md).

## Composer

It is recommended to add the keyword `heptaconnect-dataset` to the composer package that provides a dataset.
This way more people can easily find your dataset on packagist.
A common `composer.json` for a dataset providing package may look like this:

```json
{
    "name": "acme/heptaconnect-dataset-bottle",
    "description": "HEPTAconnect dataset package to provide bottles",
    "type": "library",
    "keywords": [
        "heptaconnect-dataset"
    ],
    "require": {
        "php": ">=7.4",
        "heptacom/heptaconnect-dataset-base": ">=1"
    },
    "autoload": {
        "psr-4": {
            "Acme\\Dataset\\Bottle\\": "src/"
        }
    }
}
```

## Structure

Datasets describe a collection of structures that express common properties of familiar complex structures.
These are the building blocks for portals.
A dataset should be as common as possible.
You don't have to include all possibilities at once.

In case of describing data about bottles a single bottle can be described as the following:

```php
namespace Acme\Dataset\Bottle;

use Acme\Dataset\Bottle\BottleShape;
use Acme\Dataset\Bottle\Cap;
use Acme\Dataset\Bottle\LabelCollection;
use Acme\Dataset\Bottle\Volume;
use Heptacom\HeptaConnect\Dataset\Base\Contract\DatasetEntityContract;

class Bottle extends DatasetEntityContract
{
    protected Volume $capacity;

    protected LabelCollection $labels;

    protected Cap $cap;

    protected BottleShape $shape;

    /* getters and setters */
}
```

It is important to use the base class `DatasetEntity` and use `protected` fields for internal processing in HEPTAconnect to work.

There are supporting classes to build up structures to use throughout any dataset.
As internationalization (i18n) faces everyone during a data transport we offer helpful types to make translatable fields easier to handle.

```php
namespace Acme\Dataset\Bottle;

use Heptacom\HeptaConnect\Dataset\Base\Contract\DatasetEntityContract;
use Heptacom\HeptaConnect\Dataset\Base\Translatable\TranslatableString;

class Label extends DatasetEntityContract
{
    protected TranslatableString $text;

    protected string $color;
}
```

As php does not offer generics every collection is missing the information about the types managed within the list of data.
To ensure correct data in arrays and add type hinting for IDEs we provide tooling around typed collections.
They contain psalm hints about types and just have to know the contents type to work.
Types like `StringCollection`, `IntegerCollection` and `DateTimeCollection` are already shipped in the dataset base to help building up a custom dataset very quickly.

```php
namespace Acme\Dataset\Bottle;

use Acme\Dataset\Bottle\Label;
use Heptacom\HeptaConnect\Dataset\Base\DatasetEntityCollection;

class LabelCollection extends DatasetEntityCollection
{
    protected function getT(): string
    {
        return Label::class;
    }
}
```

The usage of typed enumerations is discouraged as these are very difficult to impossible to extend.
We prefer to use constant strings.
In best case it is just a UUID as value.
This way the string value can receive new values if anyone needs to extend your dataset later on.

## Extend datasets with attachments

A dataset sometimes is not able to hold data that is needed for an integration to work.
The dataset author might have not thought of this case or evaluated it as an edge case.
In these situations you are about to extend dataset entities.
To provide additional data for the bottle entity you have to create a custom structure that holds the additional data you need.
A data extension is just an other dataset entities that can be attached to an existing entity.
As they share the same base class existing entities can be plugged into an other entity with just a few actions.

```php
namespace Acme\Dataset\Bottle;

use Acme\Dataset\Bottle\Volume;
use Heptacom\HeptaConnect\Dataset\Base\Contract\DatasetEntityContract;

class BottleContent extends DatasetEntityContract
{
    protected Volume $capacity;
}

$bottle = new Bottle();
$bottle->attach(new BottleContent());
```
