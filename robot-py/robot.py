import socketio
import os
import time
import json

os.system ("sudo pigpiod")
time.sleep(1)
import pigpio


import RoverServo as servo
import RoverESC as esc



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
    #print(data)
    parsed_data = json.loads(data)
    newY=((parsed_data["position"]["y"] / 10.24) - 50) * -1
    newX=(parsed_data["position"]["x"] / 10.24) - 50

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
        if (newX < minNum): leftMT = int((newX-minNum) * divNum * -1)
        elif (newX > maxNum): leftMT = int((newX-minNum) * divNum * -1)
        else: leftMT = 0

        if (newY < minNum): leftMF = int((newY - minNum) * divNum)
        elif (newY > maxNum): leftMF = int((newY - minNum) * divNum)
        else: leftMF = 0

        leftM = leftMT + leftMF


        if (newX < minNum): rightMT = int((newX-minNum) * divNum * 1)
        elif (newX > maxNum): rightMT = int((newX-minNum) * divNum * 1)
        else: leftMT = 0

        if (newY < minNum): rightMF = int((newY - minNum) * divNum)
        elif (newY > maxNum): rightMF = int((newY - minNum) * divNum)
        else: leftMF = 0

        leftR = leftRT + leftRF
        #print(leftM)
        #forwardMotors = (newX + newY) / 2
        #print(convertMotorValue(forwardMotors))
        #print(str(leftMT) + " " + str(leftMF) + " " + str(leftM) + " " + str(convertMotorValue(leftM)))
    else:
        trig = 0
        leftM = 0
        rightM = 0

    if (side_grip):
        sidebutton = 1
    else:
        sidebutton = 0


    
    if (view == 2):
        servo.decreaseCamera()
        camera = -1
    elif (view == 6):
        servo.increaseCamera()
        camera = 1
    else: camera = 0

    if (view == 0):
        servo.increaseServo3()
        servo3 = 1
    elif (view == 4):
        servo.decreaseServo3()
        servo3 = -1
    else: servo3 = 0


    if (Cbottom_left):
        servo.decreaseServo1()
        servo1 = -1
    elif (Ctop_left):
        servo.increaseServo1()
        servo1 = 1
    else: servo1 = 0

    if (Cbottom_right):
        servo.decreaseServo2()
        servo2 = -1
    elif (Ctop_right):
        servo.increaseServo2()
        servo2 = 1
    else: servo2 = 0

    if (Ptop_left):
        print("")
    elif (Ptop_right):
        print("")

    if (Pmiddle_left):
        RMUP = RMUP + 2
        LMUP = LMUP + 2
    elif (Pmiddle_right):
        RMUP = RMUP -2
        LMUP = LMUP -2

    if (Pbottom_left):
        print("")
    elif (Pbottom_right):
        print("")

    UpDownM = (throttle / 2.55) - 50
        
    print(str(newX) + " " + str(newY) + " " + str(throttle) + " " +  str(trig) + " " +  str(sidebutton) + " " +  str(camera) + " " +  str(servo1) + " " +  str(servo2) + " " +  str(servo3))
    
    esc.motor3_go(convertMotorValue(rightM)) #RF motor4_value
    esc.motor4_go(convertMotorValue(leftM)) #LF motor1_value
    esc.motor1_go(convertMotorValue(RMUP)) #RU motor3_value
    esc.motor2_go(convertMotorValue(LMUP)) #LU motor2_value

'''
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
'''

