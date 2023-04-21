#!/usr/bin/env python3

import socketio
import os
import time
import json
from datetime import datetime
from typing import TypedDict

class Buttons(TypedDict):
    trigger: bool
    side_grip: bool
    controller_buttons: TypedDict("ControllerButtons", {
        "bottom_left": bool,
        "bottom_right": bool,
        "top_left": bool,
        "top_right": bool,
    })
    side_panel: TypedDict("SidePanel", {
        "bottom_left": bool,
        "top_left": bool,
        "bottom_middle": bool,
        "top_middle": bool,
        "bottom_right": bool,
        "top_right": bool,
    })

class ControllerData(TypedDict):
    position: TypedDict("Position", {
        "x": float,
        "y": float,
    })
    yaw: float
    view: float
    throttle: float
    buttons: Buttons

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
    parsed_data: ControllerData = json.loads(data)
    newX=((parsed_data.position.x) - 50) * 1.9
    newY=((parsed_data.position.y) - 50) * 1.9 * -1
