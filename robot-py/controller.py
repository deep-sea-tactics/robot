#!/usr/bin/env python3

import socketio
import json
from typing import TypedDict
import RoverESC as esc
import fn-dynamicpoweralloc as dynamicpoweralloc
import numpy as np
import RoverServo
import math

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
    print(parsed_data)

    newX=(parsed_data["position"]["x"] - 50) * 2
    newY=(parsed_data["position"]["y"] - 50) * 2 * -1
    linearYaw=(parsed_data["yaw"]) * 100 # ["yaw"] ranges from -1 to 1
    yaw = (linearYaw ** 2) / 100 * math.copysign(1, linearYaw)
    if (parsed_data["buttons"]["trigger"]):
        forward_left  = max(min(newY + yaw, 100), -100)
        forward_right = max(min(newY - yaw, 100), -100)
        side_front    = max(min(newX + yaw, 100), -100)
        side_back     = max(min(newX - yaw, 100), -100)
    else:
        forward_left = 0
        forward_right = 0
        side_front = 0
        side_back = 0

	vertical = parsed_data["throttle"] * 50

    if parsed_data["view"]["y"] == 1:
        RoverServo.decreaseCamera()
    elif parsed_data["view"]["y"] == -1:
        RoverServo.increaseCamera()

    vertical = min(max(vertical, -50), 50)

	#if (vertical > 50): vertical = 50
    #elif (vertical < -50): vertical = -50

    motorOrders = [forward_left,forward_right,side_front,side_back,vertical,vertical]
    motorAmps = dynamicpoweralloc.powerRequests(np.absolute(motorOrders))
    allocatedPWM = dynamicpoweralloc.ampsToPWMEQ(motorAmps,motorOrders)
    
    pwm_forward_left = allocatedPWM[1]
    pwm_forward_right = allocatedPWM[2]
    pwm_side_front = allocatedPWM[3]
    pwm_side_back = allocatedPWM[4]
    pwm_vertical_left = allocatedPWM[5]
    pwm_vertical_right = allocatedPWM[6]
    
    #if (vertical > 50): vertical = 50
    #elif (vertical < -50): vertical = -50

    print(f'{newX} {newY}')


    esc.go_forward_right(pwm_forward_right)
    esc.go_forward_left(pwm_forward_left)
    esc.go_vertical_left(pwm_vertical_left)
    esc.go_vertical_right(pwm_vertical_right)
    esc.go_side_front(pwm_side_front)
    esc.go_side_back(pwm_side_back)

if __name__ == "__main__":
    sio.connect("http://192.168.0.3:9000")
