#!/bin/sh

v4l2-ctl --list-devices 2> /dev/null | grep H264 -A 1 | tail -1 | cut -c 2-
