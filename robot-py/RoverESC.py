import os     #importing os library so as to communicate with the system
import time   #importing time library to make Rpi wait because its too impatient 
#os.system ("sudo pigpiod") #Launching GPIO library
#time.sleep(1) # As i said it is too impatient and so if this delay is removed you will get an error
import pigpio #importing GPIO library

# -----------------------------------------
# Constant values
# -----------------------------------------
# Gpio pins
MOTOR_1=16  # Right motor
MOTOR_2=19  # Left motor
MOTOR_3=13  # Right-Up motor
MOTOR_4=12   # Left-Up motor
MOTOR_5=6
MOTOR_6=5

# PWM values for the gio pins
MAX_VALUE = 1900 # ESC's max value
ZERO_VALUE = 1500  #ESC's zero value
MIN_VALUE = 1100  #ESC's min value

# -----------------------------------------
# Initialization
# -----------------------------------------
pi = pigpio.pi();

pi.set_servo_pulsewidth(MOTOR_1, 0) 
pi.set_servo_pulsewidth(MOTOR_2, 0) 
pi.set_servo_pulsewidth(MOTOR_3, 0) 
pi.set_servo_pulsewidth(MOTOR_4, 0) 
pi.set_servo_pulsewidth(MOTOR_5, 0) 
pi.set_servo_pulsewidth(MOTOR_6, 0) 
time.sleep(1)
# 1500 sets the motor speeds off
pi.set_servo_pulsewidth(MOTOR_1, ZERO_VALUE) 
pi.set_servo_pulsewidth(MOTOR_2, ZERO_VALUE) 
pi.set_servo_pulsewidth(MOTOR_3, ZERO_VALUE) 
pi.set_servo_pulsewidth(MOTOR_4, ZERO_VALUE) 
pi.set_servo_pulsewidth(MOTOR_5, ZERO_VALUE) 
pi.set_servo_pulsewidth(MOTOR_6, ZERO_VALUE) 

print ('ESCs ready to control')
print ('MOTOR_1: gpio-'+str(MOTOR_1)+', MOTOR_2: gpio-'+str(MOTOR_2)+', MOTOR_3: gpio-'+str(MOTOR_3)+', MOTOR_4: gpio-'+str(MOTOR_4) +', MOTOR_3: gpio-'+str(MOTOR_5)+', MOTOR_3: gpio-'+str(MOTOR_6))

# -----------------------------------------
# Method Definitions
# -----------------------------------------

def motor1_go(inp): #You will use this function to program your ESC if required
	# print "Motor-1 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_1,inp)

def motor2_go(inp): #You will use this function to program your ESC if required
	# print "Motor-2 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_2,inp)

def motor3_go(inp): #You will use this function to program your ESC if required
	# print "Motor-3 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_3,inp)

def motor4_go(inp): #You will use this function to program your ESC if required
	# print "Motor-4 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_4,inp)

def motor5_go(inp): #You will use this function to program your ESC if required
	# print "Motor-5 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_5,inp)

def motor6_go(inp): #You will use this function to program your ESC if required
	# print "Motor-6 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_6,inp)

def stop_all(): 
	pi.set_servo_pulsewidth(MOTOR_1, 0)
	pi.set_servo_pulsewidth(MOTOR_2, 0)
	pi.set_servo_pulsewidth(MOTOR_3, 0)
	pi.set_servo_pulsewidth(MOTOR_4, 0)
	pi.set_servo_pulsewidth(MOTOR_5, 0)
	pi.set_servo_pulsewidth(MOTOR_6, 0)
	pi.stop()
