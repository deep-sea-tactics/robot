import socketio
import os
import time
import json

import RoverServo as servo
import RoverESC as esc

os.system ("sudo pigpiod")
time.sleep(1)
import pigpio

# -----------------------------------------
# Constant values
# -----------------------------------------

minNum = -1
maxNum = 1
divNum = 0.8


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



sio.connect("http://192.168.1.203:9000")

@sio.on('controllerData')
def on_message(data):
    print(data)
    parsed_data = json.loads(data)
    newY=parsed_data["position"]["y"]
    newX=parsed_data["position"]["x"]
    print("x: " + str(newX))
    print("y: " + str(newY))
    if (newX < minNum):
        leftMT = int((newX-minNum) * divNum * 1)
    elif (newX > maxNum):
        leftMT = int((newX-minNum) * divNum * 1)
    else: leftMT = 0
    if (newY < minNum): leftMF = int((newY - minNum) * divNum * 1)
    elif (newY > maxNum): leftMF = int((newY - minNum) * divNum * 1)
    else: leftMF = 0
    leftM = (leftMT + leftMF) / 2
    print(leftM)


    forwardMotors = (newX + newY) / 2
#    print(forwardMotors)
#    motor1_value = convertMotorValue(forwardMotors)
#    motor2_value = convertMotorValue(forwardMotors)
#    motor3_value = convertMotorValue(forwardMotors)
#    motor4_value = convertMotorValue(forwardMotors)
#    print(str(newX) + " " + str(newY))
    esc.motor3_go(convertMotorValue(forwardMotors)) #RF motor4_value
    esc.motor4_go(convertMotorValue(forwardMotors)) #LF motor1_value
    esc.motor1_go(convertMotorValue(forwardMotors)) #RU motor3_value
    esc.motor2_go(convertMotorValue(forwardMotors)) #LU motor2_value
