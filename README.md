# Open Source Image viewer

This repository has been created to coordinate developers' work in comparing Open Source IIIF image viewers. The related issue and tasks are at https://github.com/nationalarchives/Subscription-Offering/issues/143

| Feature                                   | Universal Viewer      | Mirador           | Notes
| -------------                             |:-------------:        | -----:            | -----:
| Zoom                                      |                       |                   |
| Pan                                       |                       |                   |
| Bookmark individual image                 |                       |                   |
| Add notes to individual image             |                       |                   |
| Print - individual image                  |                       |                   |
| Print - all images                        |                       |                   |
| Download - individual image               |                       |                   |
| View description (of record, not image)   |                       |                   |
| Navigate multiple pages                   |                       |                   |
| Navigate multiple pages - jump to page    |                       |                   |
| Image manipulation - core IIIF            |                       |                   |
| Image manipulation - additional           |                       |                   |


## Development machine setup

## Running an IIIF Image Server (Mac)

This directory contains the Java files for a Cantaloupe Image Server and an `images` directory from which local images are served. 

To run the Image Server use this command: 

```bash
java -Dcantaloupe.config=/Users/gwynjones/PhpstormProjects/iiif_local/cantaloupe-4.0.2/cantaloupe.properties -Xmx2g -jar cantaloupe-4.0.2.war
```

To view an image visit the following URL (replacing `image.jpg` with relevant filename): 

[http://localhost:8182/iiif/2/image.jpg/0,0,2272,3926/full/0/default.jpg](http://localhost:8182/iiif/2/image.jpg/0,0,2272,3926/full/0/default.jpg)

View the `info.json` at: 

[http://localhost:8182/iiif/2/image.jpg/info.json](http://localhost:8182/iiif/2/image.jpg/info.json)

## Running a web server 

This server will serve the HTML page (in which our image viewer will run) and the `manifest.json` file

From the `http_server` directory run `http-server -p 3000 --cors` to kick off a HTTP server running at [http://localhost:3000](http://localhost:3000)