import os     #importing os library so as to communicate with the system
import time   #importing time library to make Rpi wait because its too impatient 
os.system ("sudo pigpiod") #Launching GPIO library
time.sleep(1) # As i said it is too impatient and so if this delay is removed you will get an error
import pigpio #importing GPIO library

LIGHT_1 = 21
LIGHT_2 = 19

MAX_VALUE = 1900 # Lights's max value
ZERO_VALUE = 1100  #Lights's min value
currentLightLevel = ZERO_VALUE
lightState = 0

pi = pigpio.pi();

def setLightOnOff():
	global currentLightLevel
	global lightState
	if lightState == 1:
		lightState = 0
		pi.set_servo_pulsewidth(LIGHT_1, ZERO_VALUE)
		pi.set_servo_pulsewidth(LIGHT_2, ZERO_VALUE)
	elif lightState == 0:
		lightState = 1
		if currentLightLevel == ZERO_VALUE:
			currentLightLevel = 1500
		print('currentLightLevel1 '+str(currentLightLevel))
		pi.set_servo_pulsewidth(LIGHT_1, currentLightLevel)
		pi.set_servo_pulsewidth(LIGHT_2, currentLightLevel)
	
def increaseLights():
	global currentLightLevel
	#print('currentLightLevel1 '+str(currentLightLevel))
	inp = currentLightLevel + 10
	if inp > MAX_VALUE:
		inp = MAX_VALUE
	pi.set_servo_pulsewidth(LIGHT_1, inp)
	pi.set_servo_pulsewidth(LIGHT_2, inp)
	currentLightLevel = inp
	#print('currentLightLevel2 '+str(currentLightLevel))

def decreaseLights():
	global currentLightLevel
	inp = currentLightLevel - 10
	if inp < ZERO_VALUE:
		inp = ZERO_VALUE
	pi.set_servo_pulsewidth(LIGHT_1, inp)
	pi.set_servo_pulsewidth(LIGHT_2, inp)
	currentLightLevel = inp

'''
time.sleep(1)
pi.set_servo_pulsewidth(LIGHT_1, ZERO_VALUE)
pi.set_servo_pulsewidth(LIGHT_2, ZERO_VALUE)
time.sleep(2) 

print ('Lights on!')


time.sleep(1)
pi.set_servo_pulsewidth(LIGHT_1, 1900)
pi.set_servo_pulsewidth(LIGHT_2, 1900)
time.sleep(15)
pi.set_servo_pulsewidth(LIGHT_1, ZERO_VALUE)
pi.set_servo_pulsewidth(LIGHT_2, ZERO_VALUE)
'''

