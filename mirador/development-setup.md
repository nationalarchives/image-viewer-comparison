# Mirador-demo

## Running the viewer
This is using node to the run as a web server
Using the terminal navigate to the folder `mirador` after cloning the repo.

**Check for Node**
````
node -version
````

<br>

**Node Setup**
use the link [here](http://ronallo.com/iiif-workshop-new/preparation/web-server.html#node)

<br>

**Making the manifest available to the cantaloupe server, run the command below within the repo.**
````
http-server -p 3000 --cors
````

<br>

**Starting the cantaloupe server**
Using the terminal navigate to the `cantaloupe-4.0.2` folder and type in the command
````
java -Dcantaloupe.config=cantaloupe.properties -Xmx2g -jar cantaloupe-4.0.2.war
````

<br>

**Run the following commands within the mirador folder**
````
npm i
npm start
````

<br>

**Load up Mirador by going to**
````
http://localhost:8000
````
