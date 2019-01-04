#!/usr/bin/env bash

cd cantaloupe-4.0.2/unix

java -Dcantaloupe.config=cantaloupe.properties -Xmx2g -jar cantaloupe-4.0.2.war

npm install http-server -g

http-server -p 3000 --cors &

cd -

cd mirador && npm i && npm start &

cd -

cd universalviewer && npm i && grunt build

cd tify && http-server -p 3500 --cors