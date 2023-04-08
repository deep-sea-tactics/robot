#!/bin/sh

sudo systemctl enable pigpiod
sudo systemctl start pigpiod
pip3 install "python-socketio[client]"
