#!/bin/bash

# Output colours
GREEN='\033[0;32m'
NO_COLOUR='\033[0m'

for i in 'http-server' 'cantaloupe' 'grunt' 'Safari' 'Chrome' 'npm'

do

printf "${GREEN}Stopping ${i}${NO_COLOUR}\n"

kill $(ps aux | grep $i | awk '{print $2}') 2> /dev/null

done