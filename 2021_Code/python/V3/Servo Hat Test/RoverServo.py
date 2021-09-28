import os     #importing os library so as to communicate with the system
import time   #importing time library to make Rpi wait because its too impatient 
os.system ("sudo pigpiod") #Launching GPIO library
time.sleep(1) # As i said it is too impatient and so if this delay is removed you will get an error
import pigpio #importing GPIO library

SERVO_1 = 9

SMV = 1700
SZV = 0
SLV = 1300

pi = pigpio.pi();
	
def increaseServo(inp):
	if inp == 1:
		pi.set_servo_pulsewidth(SERVO_1, SMV)
	else:
		pi.set_servo_pulsewidth(SERVO_1, SZV)

def decreaseServo(inp):
	if inp == 1:
		pi.set_servo_pulsewidth(SERVO_1, SLV)
	else:
		pi.set_servo_pulsewidth(SERVO_1, SZV)
