import os
import socket
import sys
import array
import time
import RoverESC
import RoverLights
os.system ("sudo pigpiod")
time.sleep(1)
import pigpio

SERVO_1 = 9

SMV = 1700
SZV = 0
SLV = 1300
pi = pigpio.pi();


# -----------------------------------------
# Constant values
# -----------------------------------------

MOTOR_SHUTOFF_TIMEOUT_IN_SECONDS = 5
SERVER_PORT = 9000

#motor max, min and zero values
MAX_VALUE  = RoverESC.MAX_VALUE
ZERO_VALUE = RoverESC.ZERO_VALUE
MIN_VALUE  = RoverESC.MIN_VALUE

FORWARD_INCREMENT  = (MAX_VALUE - ZERO_VALUE) / 100
BACKWARD_INCREMENT = (ZERO_VALUE - MIN_VALUE) / 100

# --------------------------------------------------------------------
# FUNCTION: 
#   Converts value for motor (-100 to 100) to PWM value
# --------------------------------------------------------------------
def convertMotorValue(value):
    motorValue = ZERO_VALUE
    if value > 0:
        motorValue = ZERO_VALUE + FORWARD_INCREMENT*value
    else:
        motorValue = ZERO_VALUE + BACKWARD_INCREMENT*value
        
    return motorValue
    

# --------------------------------------------------------------------
# FUNCTION: 
#   Converts value from light (true or false) to PWM value
# --------------------------------------------------------------------
def getLightValue(value):
    lightValue = 1100
    if value == 1:
        lightValue = 1500
    else:
        lightValue = 1100
        
    return lightValue


# --------------------------------------------------------------------
# FUNCTION: 
#   Processes the command string recevied on the server socket
# --------------------------------------------------------------------
def processCommand(command):
    strValues = command.split(' ',10)

    if len(strValues) != 9:
        print('Unable to parse command into 9 values')
        return False       
    
    # Create an array of size 9
    values = array.array('i',[0,0,0,0,0,0,0,0,0])
    try:
        values[0] = int(strValues[0]) # RF
        values[1] = int(strValues[1]) # LU
        values[2] = int(strValues[2]) # RU
        values[3] = int(strValues[3]) # LF
        values[4] = int(strValues[4]) # Turn lights onoff
        values[5] = int(strValues[5]) # Button7 increase lights
        values[6] = int(strValues[6]) # Button4 decrease lights
        values[7] = int(strValues[7]) # Servo1
        values[8] = int(strValues[8]) # Servo2
    except ValueError:
        print('Unable to parse command into integer values')
        return False       
        
    #print('MOTOR-1:'+str(values[0])+' MOTOR-2:'+str(values[1])+' MOTOR-3:'+str(values[2])+' MOTOR-4:'+str(values[3]) )
    
    if values[0] > 100 or values[0] < -100 or values[1] > 100 or values[1] < -100 or values[2] > 100 or values[2] < -100 or values[3] > 100 or values[3] < -100:
        print('Integer values out of range')
        return False       

    motor1_value = convertMotorValue(values[0])
    motor2_value = convertMotorValue(values[1])
    motor3_value = convertMotorValue(values[2])
    motor4_value = convertMotorValue(values[3])
    lightOnOff = values[4] #getLightValue(values[4])
    lightInc = values[5]
    lightDec = values[6]
    servo1 = values[7]
    servo2 = values[8]
    
    #print('Commanding M1: '+str(motor1_value)+' M2: '+str(motor2_value)+' M3: '+str(motor3_value)+' M4: '+str(motor4_value) )
    '''
    RoverESC.motor1_go(motor1_value) #RU motor3_value
    RoverESC.motor2_go(motor4_value) #LU motor2_value
    
    RoverESC.motor3_go(motor3_value) #RF motor4_value
    RoverESC.motor4_go(motor2_value) #LF motor1_value
    '''
    
    RoverESC.motor3_go(motor2_value) #RF motor4_value
    RoverESC.motor4_go(motor3_value) #LF motor1_value
    RoverESC.motor1_go(motor1_value) #RU motor3_value
    RoverESC.motor2_go(motor4_value) #LU motor2_value

    
    if lightOnOff == 1:
        RoverLights.setLightOnOff()
    
    if lightInc == 1:
        RoverLights.increaseLights()
        
    if lightDec == 1:
        RoverLights.decreaseLights()
        
    if servo1 == 1:
        pi.set_servo_pulsewidth(SERVO_1, SMV)

    if servo1 == -1:
        pi.set_servo_pulsewidth(SERVO_1, SLV)
                
    if servo1 == 0:
        pi.set_servo_pulsewidth(SERVO_1, SZV)
        
    if servo2 == 1:
        pi.set_servo_pulsewidth(SERVO_1, SMV)

    if servo2 == -1:
        pi.set_servo_pulsewidth(SERVO_1, SLV)
                
    if servo2 == 0:
        pi.set_servo_pulsewidth(SERVO_1, SZV)
        
    return True
    
# --------------------------------------------------------------------
# FUNCTION: 
#   Zero all motors - make them stop moving
# --------------------------------------------------------------------
def zeroAllMotors():
    RoverESC.motor1_go(ZERO_VALUE)
    RoverESC.motor2_go(ZERO_VALUE)
    RoverESC.motor3_go(ZERO_VALUE)
    RoverESC.motor4_go(ZERO_VALUE)
        
# --------------------------------------------------------------------
# Main program
# --------------------------------------------------------------------

# Delay in order to wait for RoverESC to be ready
print ('Startup delay 3 seconds... start')
time.sleep(3)
print ('Startup delay 3 seconds... commanding motors to '+str(ZERO_VALUE))

# Create server socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('192.168.1.200', SERVER_PORT))
s.listen(1)
while 1:
    print('Waiting for connection on port ' + str(SERVER_PORT) )
    try:
        conn, addr = s.accept()
        print( 'Connected. Zeroing motors...')
        # Zero all motors - this is the first command that is required
        zeroAllMotors()
    except KeyboardInterrupt:
        sys.exit()
        
    # Set timeout for receiving data
    conn.settimeout(MOTOR_SHUTOFF_TIMEOUT_IN_SECONDS)
    while 1:
        # Read
        try:
            data = conn.makefile().readline()
        except socket.timeout:
            print( str(MOTOR_SHUTOFF_TIMEOUT_IN_SECONDS)+' SECOND TIMEOUT: Zeroing motors...')
            zeroAllMotors()
            continue
        except KeyboardInterrupt:
            conn.close()
            raise
        except ConnectionResetError:
            print ('ConnectionResetError')
            break
        
        # Check for client disconnected
        if not data:
            break
                    
        # Remove the newline character
        command = data[:-1]        
        print('Recieved '+command)
        result = processCommand(command)
        if result == False:
            print('processCommand failed')
            
    print('Client disconnected')
    conn.close()
    print( 'Connection closed: Shutting off the motors ( calling stop() )')
    RoverESC.stop_all()
