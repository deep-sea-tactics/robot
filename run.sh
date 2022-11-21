#!/usr/bin/env bash

(cd landstown-robotics-types; yarn build)

# kill all subshells and processes on exit
trap "kill 0" SIGINT
# start commands in subshells so all their spawn DIE when we exit
( cd ui; yarn dev ) &
( cd server; yarn dev ) &
wait
