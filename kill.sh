#!/bin/sh
fuser -k 3000/tcp # kills socket.io server
fuser -k 4000/tcp # kills ui