# Mirador-demo

## Running the viewer
This is using node to the run as a web server
Using the terminal navigate to the folder `mirador` after cloning the repo.

Check for Node
````
node -version
````
Node Setup
Use the link [here](http://ronallo.com/iiif-workshop-new/preparation/web-server.html#node)


Making the manifest available to the cantaloupe server, run the command below within the repo.
````
http-server -p 3000 --cors
````

Run the following commands within the mirador folder
````
npm i
npm start
````

Load up Mirador by going to
````
http://localhost:8000
````
