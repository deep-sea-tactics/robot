import socket
import sys
import array

# -----------------------------------------
# Constant values
# -----------------------------------------

MOTOR_SHUTOFF_TIMEOUT_IN_SECONDS = 10
SERVER_PORT = 9000

# TODO: Replace values below with ones from RoverESC
MAX_VALUE = 1900 # ESC's max value
ZERO_VALUE = 1500  #ESC's min value
MIN_VALUE = 1100  #ESC's min value

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
#   Processes the command string recevied on the server socket
# --------------------------------------------------------------------
def processCommand(command):
    strValues = command.split(' ',5)

    if len(strValues) != 4:
        print('Unable to parse command into 4 values')
        return False       
    
    # Create an array of size 4
    values = array.array('i',[0,0,0,0])
    try:
        values[0] = int(strValues[0])
        values[1] = int(strValues[1])
        values[2] = int(strValues[2])
        values[3] = int(strValues[3])
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
    
    print('Commanding M1: '+str(motor1_value)+' M2: '+str(motor2_value)+' M3: '+str(motor3_value)+' M4: '+str(motor4_value) )

    return True
    
    
# --------------------------------------------------------------------
# Main program
# --------------------------------------------------------------------
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('192.168.1.200', SERVER_PORT))
s.listen(1)
while 1:
    print('Waiting for connection on port ' + str(SERVER_PORT) )
    try:
        conn, addr = s.accept()
        print( 'Connected. Zeroing motors...')
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

