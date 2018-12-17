# Open Source Image viewer

This repository has been created to coordinate developers' work in comparing Open Source IIIF image viewers. The related issue and tasks are at https://github.com/nationalarchives/Subscription-Offering/issues/143

| Feature                                   | Universal Viewer      | Mirador           | Notes
| -------------                             |:-------------:        | -----:            | -----:
| Zoom                                      |                       |      Yes          |
| Pan                                       |                       |      Yes          |
| Bookmark individual image                 |                       |                   |
| Add notes to individual image             |                       |      Yes          |
| Print - individual image                  |                       |                   |
| Print - all images                        |                       |                   |
| Download - individual image               |                       |                   |
| View description (of record, not image)   |                       |      Yes          |
| Navigate multiple pages                   |                       |      Yes          |
| Navigate multiple pages - jump to page    |                       |                   |
| Image manipulation - core IIIF            |                       |      Yes          |
| Image manipulation - additional           |                       |      Yes          |


## Development machine setup

## Running an IIIF Image Server (Mac)

This directory contains the Java files for a Cantaloupe Image Server and an `images` directory from which local images are served. 

To run the Image Server:

1. Copy `cantaloupe.properties.sample` and save it as `cantaloupe.properties`. Then set `FilesystemSource.BasicLookupStrategy.path_prefix` to the absolute path to your `images` directory in this repository
2. run the command below (replacing `/Users/gwynjones/PhpstormProjects/iiif_local/cantaloupe-4.0.2/cantaloupe.properties` with the path to your local `cantaloupe.properties` file): 

```bash
java -Dcantaloupe.config=/Users/gwynjones/PhpstormProjects/iiif_local/cantaloupe-4.0.2/cantaloupe.properties -Xmx2g -jar cantaloupe-4.0.2.war
```

To view an image visit the following URL (replacing `image.jpg` with relevant filename): 

[http://localhost:8182/iiif/2/image.jpg/0,0,2272,3926/full/0/default.jpg](http://localhost:8182/iiif/2/image.jpg/0,0,2272,3926/full/0/default.jpg)

View the `info.json` at: 

[http://localhost:8182/iiif/2/image.jpg/info.json](http://localhost:8182/iiif/2/image.jpg/info.json)

## Running Mirador

See [Mirador setup](mirador-development-setup.md)
