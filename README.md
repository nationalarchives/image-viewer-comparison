# Open Source Image viewer

## Look in the history to see Mirador and UV

This README is now focussed on TIFY since the decision to adopt it as our IIIF image viewer. **To view other image viewers checkout an earlier commit - either in the terminal or by navigating the code in GitHub**

This repository has been created to coordinate developers' work in comparing Open Source IIIF image viewers. The related issue and tasks are at https://github.com/nationalarchives/Subscription-Offering/issues/143

| Feature                                   | Universal Viewer  | Mirador   | Tify   | Notes
| -------------                             |:-------------:    | :-:       | :-:    | :----
| Zoom                                      | Yes               |  Yes      | Yes    |
| Pan                                       | Yes               |  Yes      | Yes    |
| Rotate                                    | Yes               |  Yes      | Yes    |
| Reset                                     | No 	            |  Yes      | Yes    |**Tify** - reset only works on `Brigtness`, `Contrast` and `Satiration` changes
| Bookmark individual image                 |                   |           |        |
| Add notes to individual image             |                   |  Yes      |        |
| Print - individual image                  | Yes               |           |        |
| Print - all images                        |                   |           |        |
| Download - individual image               | Yes               |           | Yes    | Mirador - Save image as
| View description (of record, not image)   | Yes               |  Yes      | Yes    |
| Navigate multiple pages                   | Yes               |  Yes      | Yes    |
| Navigate multiple pages - jump to page    | Yes               |           | Yes    |
| Image manipulation - core IIIF            |                   |  Some     | Some   |
| Image manipulation - additional           |                   |  Yes      | Yes    |
| Client-Side manipulation - Brigthness     | No     		    |  Yes      | Yes    |
| Client-Side manipulation - Contrast       | No 		        |  Yes      | Yes    |
| Client-Side manipulation - Saturation     | No		        |  Yes      | Yes    |
| Client-Side manipulation - Grayscale      | No		        |  Yes      | Yes    |
| Client-Side manipulation - Invert colors  | No		        |  Yes      | No     |

## Daily use

Once you've followed the steps outlined in 'Development machine setup - first setup' you can use these command

### Auto launch viewers in default browser

* `npm start` will launch all image viewers in their respective tabs
* `npm stop` kills all related processes (note: this included shutting down Chrome and Safari)

## Development machine setup - _first setup_

This is a three-step process:

1. Run the image server:
	* [On Unix systems](#running-an-iiif-image-server-unix)
	* [On Windows systems](#running-an-iiif-image-server-windows)
2. [Running the web server](#running-the-web-server)
3. Starting the viewer:
	* [Tify](#running-tify)

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

5. Preview the manifest file:
````
http://localhost:3000/manifest.json

or

http://127.0.0.1:3000/manifest.json
````

### Running Tify

Run the following command at the project root:

```bash
cd tify && http-server -p 3500 --cors & open http://localhost:3500
```

### Running the HTML version only

Run the following command at the project root:

```bash
cd node-app && npm i & open http://localhost:5000
```
