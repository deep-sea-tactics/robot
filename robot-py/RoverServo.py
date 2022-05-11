import time
from adafruit_servokit import ServoKit
 
# Set channels to the number of servo channels on your kit.
# 8 for FeatherWing, 16 for Shield/HAT/Bonnet.
kit = ServoKit(channels=16)

CLAW = 4
CAMERA = 2
SPIN = 7
UPDOWN = 1


ClawMV = 90
ClawLV = 0
SpinMV = 180
SpinLV = 0
UpdownMV = 120
UpdownLV = 170
CameraMV = 60
CameraLV = 0
MID_VALUE = 130
currentClawLevel = MID_VALUE
currentSpinLevel = MID_VALUE
currentCameraLevel = MID_VALUE
currentUpdownLevel = MID_VALUE

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
        inp = currentUpdownLevel + 1
        if inp > UpdownMV:
                inp = UpdownMV
        kit.servo[UPDOWN].angle = inp
        currentUpdownLevel = inp

def decreaseUpdown():
        global currentUpdownLevel
        inp = currentUpdownLevel - 1
        if inp < UpdownLV:
                inp = UpdownLV
        kit.servo[UPDOWN].angle = inp
        currentUpdownLevel = inp

