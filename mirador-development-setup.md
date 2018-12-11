# Mirador Demo

This instructional will be comprised of three parts:

1. [Running the web server](#running-the-web-server)
2. [Running the image server](#running-the-image-server)
3. [Starting the viewer](#starting-the-viewer)

## Running the web server

In this task you will be using Node to run a web server from [these instructions](http://ronallo.com/iiif-workshop-new/preparation/web-server.html#node)

1. Using the terminal navigate to the folder `mirador` after cloning this repo.

2. Check your version of Node by running:
````
node -version
````

3. Make sure http-server is installed:
````
npm install http-server -g
````

4. To then make the manifest available to the cantaloupe server, run the command below in the current repo:
````
http-server -p 3000 --cors
````

## Running the image server

1. Using the terminal navigate to the `cantaloupe-4.0.2` folder and type in the command
````
java -Dcantaloupe.config=cantaloupe.properties -Xmx2g -jar cantaloupe-4.0.2.war
````

## Starting the viewer


1. Run the following commands within the mirador folder:
````
npm i
npm start
````

2. Load up Mirador in your web browser by going to:
````
http://localhost:8000
````
