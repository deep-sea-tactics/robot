import time
from adafruit_servokit import ServoKit
 
# Set channels to the number of servo channels on your kit.
# 8 for FeatherWing, 16 for Shield/HAT/Bonnet.
kit = ServoKit(channels=16)

CLAW = 4
CAMERA = 2
SPIN = 1
UPDOWN = 3


ClawMV = 90
ClawLV = 0
SpinMV = 180
SpinLV = 0
UpdownMV = 170
UpdownLV = 100
CameraMV = 60
CameraLV = 0
MID_VALUE = 130
currentClawLevel = 45
currentSpinLevel = 90
currentCameraLevel = 30
currentUpdownLevel = 130

def increase(servo, amount):
	kit.servo[servo].angle = amount
	return amount + 1
def decrease(servo, amount):
	kit.servo[servo].angle = amount
	return amount - 1

def increaseClaw():
	global currentClawLevel
	inp = currentClawLevel + 1
	if inp > ClawMV:
		inp = ClawMV
	kit.servo[CLAW].angle = inp
	currentClawLevel = inp

def decreaseClaw():
	global currentClawLevel
	inp = currentClawLevel - 1
	if inp < ClawLV:
		inp = ClawLV
	kit.servo[CLAW].angle = inp
	currentClawLevel = inp


def increaseSpin():
	global currentSpinLevel
	inp = currentSpinLevel + 1
	if inp > SpinMV:
		inp = SpinMV
	kit.servo[SPIN].angle = inp
	currentSpinLevel = inp
def decreaseSpin():
	global currentSpinLevel
	inp = currentSpinLevel - 1
	if inp < SpinLV:
		inp = SpinLV
	kit.servo[SPIN].angle = inp
	currentSpinLevel = inp
	
	
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



def increaseUpdown():
        global currentUpdownLevel
        currentUpdownLevel = currentUpdownLevel + 1
        if currentUpdownLevel > UpdownMV:
                currentUpdownLevel = UpdownMV
        kit.servo[UPDOWN].angle = currentUpdownLevel

def decreaseUpdown():
        global currentUpdownLevel
        currentUpdownLevel = currentUpdownLevel - 1
        if currentUpdownLevel < UpdownLV:
                currentUpdownLevel = UpdownLV
        kit.servo[UPDOWN].angle = currentUpdownLevel

