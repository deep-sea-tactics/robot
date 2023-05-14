import pigpio
from math import *

pi = pigpio.pi()

camera = 17
claw = 23
spin = 18

ClawMV = 2500
ClawLV = 1725
currentClawLevel = (ClawMV + ClawLV) / 2

SpinMV = 2500
SpinLV = 500
currentSpinLevel = (SpinMV + SpinLV) / 2

CameraMV = 960
CameraLV = 650
currentCameraLevel = (CameraMV + CameraLV) / 2


def openClaw():
        global currentClawLevel
        currentClawLevel = min(ClawMV, currentClawLevel + 50)
        pi.set_servo_pulsewidth(claw, currentClawLevel)
def closeClaw():
        global currentClawLevel
        currentClawLevel = max(ClawLV, currentClawLevel - 50)
        pi.set_servo_pulsewidth(claw, currentClawLevel)

def spinLeft():
        global currentSpinLevel
        currentSpinLevel = min(SpinMV, currentSpinLevel + 50)
        pi.set_servo_pulsewidth(spin, currentSpinLevel)
def spinRight():
        global currentSpinLevel
        currentSpinLevel = max(SpinLV, currentSpinLevel - 50)
        pi.set_servo_pulsewidth(spin, currentSpinLevel)

def increaseCamera():
        global currentCameraLevel
        currentCameraLevel = min(CameraMV, currentCameraLevel + 10)
        pi.set_servo_pulsewidth(camera, currentCameraLevel)

def decreaseCamera():
        global currentCameraLevel
        currentCameraLevel = max(CameraLV, currentCameraLevel - 10)
        pi.set_servo_pulsewidth(camera, currentCameraLevel)

if __name__  == "__main__":
        openClaw()
#        pi.set_servo_pulsewidth(claw, 1725)
#        time.sleep(1)
#        decreaseCamera(inp=3)

