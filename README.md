# Open Source Image viewer

This repository has been created to coordinate developers' work in comparing Open Source IIIF image viewers. The related issue and tasks are at https://github.com/nationalarchives/Subscription-Offering/issues/143

| Feature                                   | Universal Viewer      | Mirador           | Notes
| -------------                             |:-------------:        | :-:            | :----
| Zoom                                      |     Yes               |      Yes          |
| Pan                                       |     Yes               |      Yes          |
| Bookmark individual image                 |                       |                   |
| Add notes to individual image             |                       |      Yes          |
| Print - individual image                  |     Yes               |                   |
| Print - all images                        |                       |                   |
| Download - individual image               |     Yes               |                   |Mirador - Save image as
| View description (of record, not image)   |     Yes               |      Yes          |
| Navigate multiple pages                   |     Yes               |      Yes          |
| Navigate multiple pages - jump to page    |     Yes               |                   |
| Image manipulation - core IIIF            |                       |      Yes          |Only on the frontend.
| Image manipulation - additional           |                       |      Yes          |


## Development machine setup

This is a three-step process:

1. Run the image server:
	* [On Unix systems](#running-an-iiif-image-server-unix)
	* [On Windows systems](#running-an-iiif-image-server-windows)
2. [Running the web server](#running-the-web-server)
3. Starting the viewer:
	* [Mirador](#running-mirador)
	* [Universal Viewer](#running-universal-viewer)

### Running an IIIF Image Server (Unix)

The `cantaloupe-4.0.2` directory contains the Java files for a Cantaloupe Image Server and an `images` directory from which local images are served. 

To run the Image Server on a unix machine:

1. Using the terminal navigate to `cantaloupe-4.0.2/unix` folder and run the following command:

```bash
java -Dcantaloupe.config=cantaloupe.properties -Xmx2g -jar cantaloupe-4.0.2.war
```

2. To view an image visit the following URL: 

[http://localhost:8182/iiif/2/image01.jpg/0,0,2272,3926/full/0/default.jpg](http://localhost:8182/iiif/2/image01.jpg/0,0,2272,3926/full/0/default.jpg)

View the `info.json` at: 

[http://localhost:8182/iiif/2/image01.jpg/info.json](http://localhost:8182/iiif/2/image01.jpg/info.json)

### Running an IIIF Image Server (Windows)

Documentation in progress

### Running the web server

In this task you will be using Node to run a web server from [these instructions](http://ronallo.com/iiif-workshop-new/preparation/web-server.html#node) in order to host the manifest file.

1. Using the terminal navigate to the project root

2. Check your version of Node by running:
````
node -v
````

3. Make sure http-server is installed:
````
npm install http-server -g
````

4. Run the command below to start up the server:
````
http-server -p 3000 --cors
````

### Running Mirador

1. Run the following commands at the project root:
````
cd mirador && npm i && npm start
````

2. Load up Mirador in your web browser by going to:
````
http://localhost:8000
````

### Running Universal Viewer

1. Run the following commands at the project root:
````
cd universalviewer && npm i && grunt build
````

2. Load up Universal Viewer in your web browser by going to:
````
http://localhost:3000/uv.html
````

### Running Tify

Run the following command at the project root:

```bash
cd tify && http-server -p 3500 --cors & open http://localhost:3500
```
