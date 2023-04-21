#!/usr/bin/env python3

import socketio
import os
import time
import json
from datetime import datetime

sio = socketio.Client()

@sio.event
def connect():
    print('Robot connected. SID: ', sio.sid)

@sio.event
def connect_error(data):
    print("Robot connection error: ", data)

@sio.event
def disconnect():
    print("Robot disconnected.")



sio.connect("http://192.168.0.3:9000")

@sio.on('controllerData')
def on_message(data):
    print(data)
    global UpDownM
    global oldThrottle
    global camSwitch
    global oldTime
    global amount
    camera = 0
    updown = 0
    parsed_data = json.loads(data)
    newY=((parsed_data["position"]["y"]) - 50) * -1.9
    newX=((parsed_data["position"]["x"]) - 50) * 1.9

    yaw=parsed_data["yaw"]
    view=parsed_data["view"]
    throttle=parsed_data["throttle"]
    trigger=parsed_data["buttons"]["trigger"]
    side_grip=parsed_data["buttons"]["side_grip"]

    Cbottom_left=parsed_data["buttons"]["controller_buttons"]["bottom_left"]
    Cbottom_right=parsed_data["buttons"]["controller_buttons"]["bottom_right"]
    Ctop_left=parsed_data["buttons"]["controller_buttons"]["top_left"]
    Ctop_right=parsed_data["buttons"]["controller_buttons"]["top_right"]

    Ptop_left=parsed_data["buttons"]["side_panel"]["top_left"]
    Ptop_right=parsed_data["buttons"]["side_panel"]["top_right"]
    Pmiddle_left=parsed_data["buttons"]["side_panel"]["middle_left"]
    Pmiddle_right=parsed_data["buttons"]["side_panel"]["middle_right"]
    Pbottom_left=parsed_data["buttons"]["side_panel"]["bottom_left"]
    Pbottom_right=parsed_data["buttons"]["side_panel"]["bottom_right"]

