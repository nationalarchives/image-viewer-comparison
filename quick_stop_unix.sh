#!/bin/bash

# Output colours
RED='\033[1;31m'
NO_COLOUR='\033[0m'
GREEN='\033[1;32m'

for i in 'http-server' 'cantaloupe' 'grunt' 'Safari.app' 'Chrome'

do


kill $(ps aux | grep $i | awk '{print $2}') 2> /dev/null

if pgrep $i; then
    printf "${RED}😱 ${i} is still running ${NO_COLOUR} - run npm stop again\n"
else
    printf "☠️️ ${GREEN} Stopped${NO_COLOUR} ${i}\n"
fi

done

printf "\n\n"
