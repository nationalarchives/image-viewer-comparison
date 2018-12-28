#!/bin/bash

# Change directory and run cantaloupe with Java as a background task
cd cantaloupe-4.0.2/unix && java -Dcantaloupe.config=cantaloupe.properties -Xmx2g -jar cantaloupe-4.0.2.war &

# Start the http-server
http-server -p 3000 --cors &

# Start Mirador
cd mirador && npm start &

# Start Universal Viewer
cd universalviewer && grunt build &

# Start Tify
cd tify && http-server -p 3500 --cors &

# Poll to see if our Image Server is running and, if so, open our browser windows

# Output colours
RED='\033[1;31m'
GREEN='\033[1;32m'
EMPHASIS='\033[1;36m'
NO_COLOUR='\033[0m'

function print_tna {
    printf "         _____ _   _   ___ \n"
    printf "        |_   _| \ | | / _ \ \n"
    printf "          | | |  \| |/ /_\ \\n"
    printf "          | | | . \` ||  _  |\n"
    printf "          | | | |\  || | | |\n"
    printf "          \_/ \_| \_/\_| |_/\n\n"
}

if ping -c 10 -i 2 http://localhost:8182/iiif/2/image01.jpg/info.json; then
    print_tna
    printf "${EMPHASIS}#########################################${NO_COLOUR}\n"
    printf "${GREEN}Connected to Cantaloupe image server ${i}${NO_COLOUR}\n"
    printf "${EMPHASIS}#########################################${NO_COLOUR}\n"
    open http://localhost:8000
    open http://localhost:3000/uv.html
    open http://localhost:3500
else
    print_tna
    printf "${EMPHASIS}#########################################${NO_COLOUR}\n"
    printf "${RED}Cannot connect to Cantaloupe image server ${i}${NO_COLOUR}\n"
    printf "${EMPHASIS}#########################################${NO_COLOUR}\n"
fi
