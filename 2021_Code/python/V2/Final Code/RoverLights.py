import os     #importing os library so as to communicate with the system
import time   #importing time library to make Rpi wait because its too impatient 
os.system ("sudo pigpiod") #Launching GPIO library
time.sleep(1) # As i said it is too impatient and so if this delay is removed you will get an error
import pigpio #importing GPIO library

LIGHT_1 = 21
LIGHT_2 = 19

MAX_VALUE = 1900 # Lights's max value
ZERO_VALUE = 1100  #Lights's min value

pi = pigpio.pi();

time.sleep(1)
pi.set_servo_pulsewidth(LIGHT_1, ZERO_VALUE)
pi.set_servo_pulsewidth(LIGHT_2, ZERO_VALUE)
time.sleep(2) 

print ('Lights on!')
time.sleep(1)
pi.set_servo_pulsewidth(LIGHT_1, 1700)
pi.set_servo_pulsewidth(LIGHT_2, 1700)
time.sleep(6)
pi.set_servo_pulsewidth(LIGHT_1, ZERO_VALUE)
pi.set_servo_pulsewidth(LIGHT_2, ZERO_VALUE)
