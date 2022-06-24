#!/bin/sh

sudo npm i -g request node-pre-gyp # necessary for mocking
(cd client && sudo rm -rf node_modules && npm install)
(cd server && sudo rm -rf node_modules && npm install)
