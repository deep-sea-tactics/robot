#!/usr/bin/env python3

import socketio
import json
from typing import TypedDict

class ControllerButtons(TypedDict):
	bottom_left: bool
	bottom_right: bool
	top_left: bool
	top_right: bool

class SidePanel(TypedDict):
	bottom_left: bool
	top_left: bool
	bottom_middle: bool
	top_middle: bool
	bottom_right: bool
	top_right: bool

class Buttons(TypedDict):
    trigger: bool
    side_grip: bool
    controller_buttons: ControllerButtons
    side_panel: SidePanel

class Position(TypedDict):
	x: float
	y: float

class ControllerData(TypedDict):
    position: Position
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
    newX=((parsed_data["position"]["x"]) - 50) * 1.9
    newY=((parsed_data["position"]["y"]) - 50) * 1.9 * -1
