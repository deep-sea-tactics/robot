import socketio
import RoverServo as servo


# standard Python
sio = socketio.Client()

sio.connect("http://192.168.1.203:9000")

@sio.on('position')
def on_message(data):
#    print(data)
    newData=data.split(",")
    y=newData[1]
    x=newData[0] + "}"
#    print(x + " " + y)
    newY=float(y[4:-1])
    newX=float(x[5:-1])
    print(str(newX) + " " + str(newY))
    servo.decreaseServo1()

@sio.event
def connect():
	print('Robot connected. SID: ', sio.sid)

@sio.event
def connect_error(data):
    print("Robot connection error: ", data)

@sio.event
def disconnect():
    print("Robot disconnected.")

