import time
from adafruit_servokit import ServoKit
 
# Set channels to the number of servo channels on your kit.
# 8 for FeatherWing, 16 for Shield/HAT/Bonnet.
kit = ServoKit(channels=16)

SERVO_1 = 0
SERVO_2 = 1

Servo1MV = 180
Servo1LV = 0
Servo2MV = 180
Servo2LV = 100
MID_VALUE = 130
currentServo1Level = MID_VALUE
currentServo2Level = MID_VALUE



def increaseServo1():
	global currentServo1Level
	inp = currentServo1Level + 5
	if inp > Servo1MV:
		inp = Servo1MV
	kit.servo[SERVO_1].angle = inp
	currentServo1Level = inp

def decreaseServo1():
	global currentServo1Level
	inp = currentServo1Level - 5
	if inp < Servo1LV:
		inp = Servo1LV
	kit.servo[SERVO_1].angle = inp
	currentServo1Level = inp


def increaseServo2():
	global currentServo2Level
	inp = currentServo2Level + 5
	if inp > Servo2MV:
		inp = Servo2MV
	kit.servo[SERVO_2].angle = inp
	currentServo2Level = inp

def decreaseServo2():
	global currentServo2Level
	inp = currentServo2Level - 5
	if inp < Servo2LV:
		inp = Servo2LV
	kit.servo[SERVO_2].angle = inp
	currentServo2Level = inp
