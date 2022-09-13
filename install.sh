#!/bin/sh

sudo npm i -g request node-pre-gyp # necessary for mocking
(cd client && yarn)
(cd server && yarn)
