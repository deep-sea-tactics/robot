#!/bin/sh
# This starts up the raw website used to make sure that the cameras work properly.
# Can use both the mocking cameras and the real cameras on the robot.

if ! command -v http-server &> /dev/null
then
    pnpm i -g http-server
fi

http-server -c-1 -o raw.html client/src