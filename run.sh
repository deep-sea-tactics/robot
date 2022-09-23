#!/bin/bash

# kill all subshells and processes on exit
trap "kill 0" SIGINT
# start commands in subshells so all their spawn DIE when we exit
( cd client; yarn dev ) &
( cd server; yarn dev ) &
wait