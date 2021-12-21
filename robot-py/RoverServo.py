import time
from adafruit_servokit import ServoKit
 
# Set channels to the number of servo channels on your kit.
# 8 for FeatherWing, 16 for Shield/HAT/Bonnet.
kit = ServoKit(channels=16)

SERVO_1 = 0
CAMERA = 2
SERVO_3 = 3


Servo1MV = 180
Servo1LV = 0
Servo2MV = 180
Servo2LV = 80
Servo3MV = 90
Servo3LV = 0
CameraMV = 50
CameraLV = 0
MID_VALUE = 130
currentServo1Level = MID_VALUE
currentServo2Level = MID_VALUE
currentCameraLevel = MID_VALUE
currentServo3Level = MID_VALUE

def increaseServo1():
	global currentServo1Level
	inp = currentServo1Level + 3.5
	if inp > Servo1MV:
		inp = Servo1MV
	kit.servo[SERVO_1].angle = inp
	currentServo1Level = inp

def decreaseServo1():
	global currentServo1Level
	inp = currentServo1Level - 3.5
	if inp < Servo1LV:
		inp = Servo1LV
	kit.servo[SERVO_1].angle = inp
	currentServo1Level = inp


def increaseServo2(servo2_inc):
	if servo2_inc == 1:
		kit.continuous_servo[SERVO_2].throttle = 1
	else:
		kit.continuous_servo[SERVO_2].throttle = 0

def decreaseServo2(servo2_dec):
	if servo2_dec == -1:
		kit.continuous_servo[SERVO_2].throttle = -1
	else:
		kit.continuous_servo[SERVO_2].throttle = 0

def increaseCamera():
        global currentCameraLevel
        inp = currentCameraLevel + 1
        if inp > CameraMV:
                inp = CameraMV
        kit.servo[CAMERA].angle = inp
        currentCameraLevel = inp

def decreaseCamera():
        global currentCameraLevel
        inp = currentCameraLevel - 1
        if inp < CameraLV:
                inp = CameraLV
        kit.servo[CAMERA].angle = inp
        currentCameraLevel = inp



def increaseServo3():
        global currentServo3Level
        inp = currentServo3Level + 2.5
        if inp > Servo3MV:
                inp = Servo3MV
        kit.servo[SERVO_3].angle = inp
        currentServo3Level = inp

def decreaseServo3():
        global currentServo3Level
        inp = currentServo3Level - 2.5
        if inp < Servo3LV:
                inp = Servo3LV
        kit.servo[SERVO_3].angle = inp
        currentServo3Level = inp

