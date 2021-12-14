#!/bin/sh

npm i -g pnpm
(cd client; pnpm install)
(cd server; pnpm install)
(cd robot; pnpm install)
(cd robot-py; pip install -r requirements.txt)