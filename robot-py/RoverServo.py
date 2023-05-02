import pigpio
import time

pi = pigpio.pi()

camera = 17
claw = 0
spin = 0

ClawMV = 90
ClawLV = 0
currentClawLevel = (ClawMV + ClawLV) / 2

SpinMV = 180
SpinLV = 0
currentSpinLevel = (ClawMV + ClawLV) / 2

CameraMV = 960
CameraLV = 650
currentCameraLevel = (CameraMV + CameraLV) / 2


def increaseClaw():
	global currentClawLevel
	inp = currentClawLevel + 1
	if inp > ClawMV:
		inp = ClawMV
	currentClawLevel = inp

def decreaseClaw():
	global currentClawLevel
	inp = currentClawLevel - 1
	if inp < ClawLV:
		inp = ClawLV
	currentClawLevel = inp


def increaseSpin():
	global currentSpinLevel
	inp = currentSpinLevel + 1
	if inp > SpinMV:
		inp = SpinMV
	currentSpinLevel = inp
def decreaseSpin():
	global currentSpinLevel
	inp = currentSpinLevel - 1
	if inp < SpinLV:
		inp = SpinLV
	currentSpinLevel = inp

def increaseCamera():
        global currentCameraLevel
        currentCameraLevel = currentCameraLevel + 10
        if currentCameraLevel > CameraMV:
                currentCameraLevel = CameraMV
        pi.set_servo_pulsewidth(camera, currentCameraLevel)

def decreaseCamera():
        global currentCameraLevel
        currentCameraLevel = currentCameraLevel - 10
        if currentCameraLevel < CameraLV:
                currentCameraLevel = CameraLV
        pi.set_servo_pulsewidth(camera, currentCameraLevel)

if __name__  == "__main__":
#       increaseCamera()
        pi.set_servo_pulsewidth(camera, 1900)
#        time.sleep(1)
#        decreaseCamera(inp=3)

