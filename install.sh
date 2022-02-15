#!/bin/sh

npm i -g pnpm
(cd client; pnpm install)
(cd server; pnpm install)
(cd robot; pnpm install)
(cd robot-py; pip install -r requirements.txt)

sudo apt-get install python-pigpio python3-pigpio # install python bindings