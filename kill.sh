#!/usr/bin/env bash

fuser -k 3000/tcp # kills socket.io server
fuser -k 4000/tcp # kills ui
