import socket
import sys
import time
from tempSensors import read_temp_Inside, read_temp_Outside
from breachAlert import leakCheck

#----------------------------------------------
# CONSTANTS
#----------------------------------------------

DATA_FREQUENCY_IN_SECONDS = 5
TIMEOUT_IN_SECONDS = 10
SERVER_PORT = 9001

#----------------------------------------------
# FUNCTION
#   Returns exterior temperature reading 
#   as a string that will be sent to the client
#----------------------------------------------
def readExteriorTemp():
    reading = read_temp_Outside()
    return str(reading)

#----------------------------------------------
# FUNCTION
#   Returns interior temperature reading 
#   as a string that will be sent to the client
#----------------------------------------------
def readInteriorTemp():
    reading = read_temp_Inside()
    return str(reading)

#----------------------------------------------
# FUNCTION
#   Returns leak data from SOS sensor reading
#----------------------------------------------
def readLeakSensor():
    reading = leakCheck()
    return reading

#----------------------------------------------
# MAIN PROGRAM
#----------------------------------------------
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('192.168.1.200', SERVER_PORT))
s.listen(1)
while 1:
    print('Waiting for connection on port ' + str(SERVER_PORT) )
    try:
        conn, addr = s.accept()
    except KeyboardInterrupt:
        sys.exit()
    except Exception as exc:
        print(str(exc))
             
    # Set timeout for receiving data
    #conn.settimeout(MOTOR_SHUTOFF_TIMEOUT_IN_SECONDS)
    print ('Connected. Starting to collect and send sensor data...')
    print ('Data format is: <exterior temp> <interior temp> <leak sensor status>')
    try:
        while 1:
            
            # Generate data
            data = readExteriorTemp()+' '
            data += readInteriorTemp()+' '
            +readLeakSensor()+'\r\n'
            
            # Convert data to bytes and send to the connected client
            print (data, end = ' ')
            conn.sendall(data.encode())
                    
            # Delay 
            time.sleep(DATA_FREQUENCY_IN_SECONDS)
        
    except KeyboardInterrupt:
        print ('Stopped by user')
    except ConnectionResetError:
        print ('ConnectionResetError')
    except ConnectionAbortedError:
        print ('ConnectionAbortedError')
        
    print('Client disconnected')
    conn.close()
    print( 'Connection closed')



    
