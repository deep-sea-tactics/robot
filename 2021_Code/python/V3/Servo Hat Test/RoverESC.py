# -----------------------------------------
# Imports
# -----------------------------------------
import os     #importing os library so as to communicate with the system
import time   #importing time library to make Rpi wait because its too impatient 
os.system ("sudo pigpiod") #Launching GPIO library
time.sleep(1) # As i said it is too impatient and so if this delay is removed you will get an error
import pigpio #importing GPIO library

import board
import busio
import adafruit_pca9685
i2c = busio.I2C(board.SCL, board.SDA)
hat = adafruit_pca9685.PCA9685(i2c)
from adafruit_servokit import ServoKit
kit = ServoKit(channels=16)


# -----------------------------------------
# Constant values
# -----------------------------------------
# Gpio pins
motor_channel = hat.channels[0]



kit.servo[0].angle = 20
time.sleep(10)
kit.servo[0].angle = 0
