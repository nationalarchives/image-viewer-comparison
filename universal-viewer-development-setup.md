# Universal Viewer Demo

This instructional will be comprised of three parts:

1. [Running the web server](#running-the-web-server)
2. [Running the image server](#running-the-image-server)
3. [Starting the viewer](#starting-the-viewer)

## Running the web server

In this task you will be using Node to run a web server from [these instructions](http://ronallo.com/iiif-workshop-new/preparation/web-server.html#node)

1. Using the terminal navigate to the folder `universalviewer` after cloning this repo.

2. Check your version of Node by running:
````
node -v
````

3. Run the following commands within the universalviewer folder:
````
npm i
grunt build
````

4. Make sure http-server is installed:
````
npm install http-server -g
````

5. Navigate back out to the project root and run the command below to start up the server:
````
http-server -p 3000 --cors
````

## Running the image server

1. Using the terminal navigate to the `cantaloupe-4.0.2` folder and type in the command
````
java -Dcantaloupe.config=cantaloupe.properties -Xmx2g -jar cantaloupe-4.0.2.war
````

## Starting the viewer


1. Load up the Universal Viewer in your web browser by going to:
````
http://localhost:8000/uv.html
````
