import socketio

# standard Python
sio = socketio.Client()

sio.connect("http://192.168.1.202:9000")

@sio.on('position')
def on_message(data):
    print(data)


print('Robot connected. SID: ', sio.sid)

@sio.event
def connect():
    print("Robot connected!")

@sio.event
def connect_error(data):
    print("Robot connection error: ", data)

@sio.event
def disconnect():
    print("Robot disconnected.")

