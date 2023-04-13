#!/usr/bin/env python3

import socketio
import json
from typing import TypedDict
import RoverESC as esc


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
    view: Position
    throttle: float
    buttons: Buttons

sio = socketio.Client()

@sio.event
def connect():
    print('Robot connected. SID: ', sio.sid)

@sio.event
def connect_error(data):
    esc.stop_all()
    print("Robot connection error: ", data)

@sio.event
def disconnect():
    esc.stop_all()
    print("Robot disconnected.")
    exit(0)

@sio.on('controllerData')
def on_message(data):
    parsed_data: ControllerData = json.loads(data)
    #print(parsed_data)

    newX=(parsed_data["position"]["x"] - 50) * 1.9
    newY=(parsed_data["position"]["y"] - 50) * 1.9 * -1

    if (parsed_data["buttons"]["trigger"]):
        forward_left = newY + newX
        forward_right = newY - newX
        #side_front = newY
        #side_back = newY


    else:
        forward_left = 0
        forward_right = 0
        side_front = 0
        side_back = 0

    vertical = (parsed_data["throttle"] * 50)

    if (vertical > 50): vertical = 50
    elif (vertical < -50): vertical = -50

    print(f'{newX} {newY} {vertical}')


    esc.go_forward_right(forward_right)
    esc.go_forward_left(forward_left)
    esc.go_vertical_left(vertical)
    esc.go_vertical_right(vertical)
    esc.go_side_front(0)
    esc.go_side_back(0)

if __name__ == "__main__":
    sio.connect("http://192.168.0.3:9000")
