import socketio
import os
import time
import json
from datetime import datetime

os.system("sudo pigpiod")
time.sleep(0.5)

import RoverServo as servo
import RoverESC as esc



# -----------------------------------------
# Constant values
# -----------------------------------------
camSwitch = 0
minNum = -1
maxNum = 1
spin = 0
divNum = 0.8
oldThrottle = 0
UpDownM = 0
oldTime = 0
amount = 130
MOTOR_SHUTOFF_TIMEOUT_IN_SECONDS = 3
SERVER_PORT = 9000

#motor max, min and zero values
MAX_VALUE  = esc.MAX_VALUE
ZERO_VALUE = esc.ZERO_VALUE
MIN_VALUE  = esc.MIN_VALUE

FORWARD_INCREMENT  = (MAX_VALUE - ZERO_VALUE) / 100
BACKWARD_INCREMENT = (ZERO_VALUE - MIN_VALUE) / 100

# --------------------------------------------------------------------
# FUNCTION: 
#   Converts value for motor (-100 to 100) to PWM value
# --------------------------------------------------------------------
def convertMotorValue(value):
    motorValue = ZERO_VALUE
    if value > 0:
        motorValue = ZERO_VALUE + FORWARD_INCREMENT*value
    else:
        motorValue = ZERO_VALUE + BACKWARD_INCREMENT*value
        
    return motorValue


# standard Python
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



sio.connect("http://192.168.1.202:9000")

@sio.on('controllerData')
def on_message(data):
    global UpDownM
    global oldThrottle
    global camSwitch
    global oldTime
    global amount
    camera = 0
    updown = 0
    #print(data)
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

    if (trigger):
        trig = 1
        leftM = newY + newX
        rightM = newY - newX
    else:
        trig = 0
        leftM = 0
        rightM = 0

    if (side_grip):
        sidebutton = 1
    else:
        sidebutton = 0

    if (Pmiddle_left):
        UpDownM = UpDownM
    elif (Pmiddle_right):
        UpDownM = UpDownM
    UpDownM = (throttle / 2.55) - 50

    if (UpDownM > 50): UpDownM = 50
    elif (UpDownM < -50): UpDownM = -50

    if (view == 2):
        servo.decreaseCamera()
        camera = -1
        view = 5
    elif (view == 6):
        servo.increaseCamera()
        camera = 1
        view = 5
    elif (view == 0):
        amount = servo.increase(3, amount)
#        servo.increaseUpdown()
        updown = 1
        view = 5
    elif (view == 4):
        amount = servo.decrease(3, amount)
#        servo.decreaseUpdown()
        updown = -1
        view = 5
    else:
        updown = 0
        camera = 0
        view = 5

    if (Cbottom_left):
        servo.decreaseClaw()
        claw = -1
    elif (Ctop_left):
        servo.increaseClaw()
        claw = 1
    else: claw = 0

    if (Cbottom_right):
        servo.decreaseSpin()
        spin = -1
    elif (Ctop_right):
        servo.increaseSpin()
        spin = 1
    else: spin = 0

    if (Ptop_left):
        print("")
    elif (Ptop_right):
        print("")


    if (Pbottom_left):
        if camSwitch == 0:
            if oldTime + 2 < int(datetime.now().strftime("%S")) or True:
                camSwitch = 1
                oldTime = int(datetime.now().strftime("%S"))
                os.system("sudo systemctl stop camera2.service")
                os.system("sudo systemctl start camera3.service")
        elif camSwitch == 1:
            if oldTime + 2 < int(datetime.now().strftime("%S")) or True:
                oldTime = int(datetime.now().strftime("%S"))
                camSwitch = 0
                os.system("sudo systemctl stop camera3.service")
                os.system("sudo systemctl start camera2.service")
    elif (Pbottom_right):
        print("")

    print(str(int(newX)) + " " + str(int(newY)) + " " + str(int(UpDownM)) + " " +  str(trig) + " " +  str(sidebutton) + " " +  str(camera) + " " +  str(claw) + " " +  str(spin) + " " +  str(updown))

    esc.motor3_go(convertMotorValue(rightM)) #RF motor4_value
    esc.motor4_go(convertMotorValue(leftM)) #LF motor1_value
    esc.motor1_go(convertMotorValue(UpDownM)) #RU motor3_value
    esc.motor2_go(convertMotorValue(UpDownM)) #LU motor2_value
