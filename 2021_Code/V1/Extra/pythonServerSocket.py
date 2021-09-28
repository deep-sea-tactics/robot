#simple socket server using threads

import socket
import sys

HOST = '192.168.1.200'                       
PORT = 8888

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
print("Socket created")

try:
    s.bind((HOST, PORT))
except socket.error as msg:
    print("Bind failed. Error Code : " + str(msg[0]) + " Message " + msg[1])
    sys.exit()
    
print("Socket bind complete")

s.listen(10)
print("Socket now listening")

while 1:
    conn, addr = s.accept()
    print("Connected with " + addr[0] + ":" + str(addr[1]))
    
s.close()
