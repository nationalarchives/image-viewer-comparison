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
    clear
    printf "${RED}                  \`.-::///.        \n      ${NO_COLOUR}"
    printf "${RED}          ---..\`/yyyys.            \n      ${NO_COLOUR}"
    printf "${RED}        -s.    \`s++yyys\`          \n      ${NO_COLOUR}"
    printf "${RED}       .yy\`    oo  oyyyo\`         \n      ${NO_COLOUR}"
    printf "${RED}       ./.    +s\`  \`syyyo         \n      ${NO_COLOUR}"
    printf "${RED}             :y/----/yyyy+          \n      ${NO_COLOUR}"
    printf "${RED}            -yyyyyyyyyyyyy/         \n      ${NO_COLOUR}"
    printf "${RED}           -s.\`\`\`\`\`\`\`\`:yyyy:\n      ${NO_COLOUR}"
    printf "${RED}  .       :+\`          /yyyy-      \n      ${NO_COLOUR}"
    printf "${RED}\`oyo:-.-:/.             :////      \n      ${NO_COLOUR}"
    printf "${RED} .:///-.                            \n      ${NO_COLOUR}"
}

image_server_status="not_connected"

while [ $image_server_status=="not_connected" ]

do
    printf $image_server_status;

    if curl http://localhost:8182/iiif/2/image01.jpg/info.json; then

        print_tna

        printf "\n"

        printf "${EMPHASIS}########################################${NO_COLOUR}\n"
        printf "${GREEN} 👍 Connected to Cantaloupe image server ${i}${NO_COLOUR}\n"
        printf "${EMPHASIS}########################################${NO_COLOUR}\n"

        printf "\n\n\n"

        open http://localhost:8000
        open http://localhost:3000/uv.html
        open http://localhost:3500

        $image_server_status="connected"

        say "triple eye eff server is running"

        break

    else

        print_tna

        printf "\n"

        printf "${EMPHASIS}#############################################${NO_COLOUR}\n"
        printf "${RED} 👎 Cannot connect to Cantaloupe image server ${i}${NO_COLOUR}\n"
        printf "${EMPHASIS}#############################################${NO_COLOUR}\n"

        say "triple eye eff server is down" --voice "Bad news"

    fi

    sleep 3;

done
