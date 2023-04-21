import pigpio #importing GPIO library

# -----------------------------------------
# Constant values
# -----------------------------------------
# Gpio pins
MOTOR_forward_right=13  # Forward Right Motor
MOTOR_forward_left=5  # Forward Left Motor
MOTOR_vertical_left=19  # Vertical Left Motor
MOTOR_vertical_right=16  # Vertical Right Motor
MOTOR_side_front=12   # Sideways Front Motor
MOTOR_side_back=6   # Sideways Back Motor

# PWM values for the gio pins
MAX_VALUE = 1900 # ESC's max value
ZERO_VALUE = 1500  #ESC's zero value
MIN_VALUE = 1100  #ESC's min value

FORWARD_INCREMENT  = (MAX_VALUE - ZERO_VALUE) / 100
BACKWARD_INCREMENT = (ZERO_VALUE - MIN_VALUE) / 100

# -----------------------------------------
# Initialization
# -----------------------------------------
pi = pigpio.pi()

pi.set_servo_pulsewidth(MOTOR_forward_right, 0)
pi.set_servo_pulsewidth(MOTOR_forward_left, 0)
pi.set_servo_pulsewidth(MOTOR_vertical_left, 0)
pi.set_servo_pulsewidth(MOTOR_vertical_right, 0)
pi.set_servo_pulsewidth(MOTOR_side_front, 0)
pi.set_servo_pulsewidth(MOTOR_side_back, 0)

# 1500 sets the motor speeds off
pi.set_servo_pulsewidth(MOTOR_forward_right, ZERO_VALUE)
pi.set_servo_pulsewidth(MOTOR_forward_left, ZERO_VALUE)
pi.set_servo_pulsewidth(MOTOR_vertical_left, ZERO_VALUE)
pi.set_servo_pulsewidth(MOTOR_vertical_right, ZERO_VALUE)
pi.set_servo_pulsewidth(MOTOR_side_front, ZERO_VALUE)
pi.set_servo_pulsewidth(MOTOR_side_back, ZERO_VALUE)

print ('ESCs ready to control')
#print ('MOTOR_1: gpio-'+str(MOTOR_1)+', MOTOR_2: gpio-'+str(MOTOR_2)+', MOTOR_3: gpio-'+str(MOTOR_3)+', MOTOR_4: gpio-'+str(MOTOR_4) +', MOTOR_3: gpio-'+str(MOTOR_5)+', MOTOR_3: gpio-'+str(MOTOR_6))

# -----------------------------------------
# Method Definitions
# -----------------------------------------

# Converts value for motor (-100 to 100) to PWM value
def convertMotorValue(value):
    motorValue = ZERO_VALUE
    if value > 0:
        motorValue = ZERO_VALUE + FORWARD_INCREMENT * value
    else:
        motorValue = ZERO_VALUE + BACKWARD_INCREMENT * value
    return motorValue


def go_forward_right(inp): #You will use this function to program your ESC if required
	# print "Motor-1 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_forward_right,convertMotorValue(inp))

def go_forward_left(inp): #You will use this function to program your ESC if required
	# print "Motor-2 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_forward_left,convertMotorValue(inp))

def go_vertical_left(inp): #You will use this function to program your ESC if required
	# print "Motor-3 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_vertical_left,convertMotorValue(inp))

def go_vertical_right(inp): #You will use this function to program your ESC if required
	# print "Motor-4 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_vertical_right,convertMotorValue(inp))

def go_side_front(inp): #You will use this function to program your ESC if required
	# print "Motor-5 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_side_front,convertMotorValue(inp))

def go_side_back(inp): #You will use this function to program your ESC if required
	# print "Motor-6 speed to " + str(inp)
	pi.set_servo_pulsewidth(MOTOR_side_back,convertMotorValue(inp))

def stop_all():
	pi.set_servo_pulsewidth(MOTOR_forward_right, ZERO_VALUE)
	pi.set_servo_pulsewidth(MOTOR_forward_left, ZERO_VALUE)
	pi.set_servo_pulsewidth(MOTOR_vertical_left, ZERO_VALUE)
	pi.set_servo_pulsewidth(MOTOR_vertical_right, ZERO_VALUE)
	pi.set_servo_pulsewidth(MOTOR_side_front, ZERO_VALUE)
	pi.set_servo_pulsewidth(MOTOR_side_back, ZERO_VALUE)
	pi.set_servo_pulsewidth(MOTOR_forward_right, 0)
	pi.set_servo_pulsewidth(MOTOR_forward_left, 0)
	pi.set_servo_pulsewidth(MOTOR_vertical_left, 0)
	pi.set_servo_pulsewidth(MOTOR_vertical_right, 0)
	pi.set_servo_pulsewidth(MOTOR_side_front, 0)
	pi.set_servo_pulsewidth(MOTOR_side_back, 0)
	pi.stop()
