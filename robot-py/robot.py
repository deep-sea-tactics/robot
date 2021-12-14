import socketio

# standard Python
sio = socketio.Client()

sio.connect("http://192.168.1.202")

@sio.on('position')
def on_message(data):
    print(data)

@sio.event
def connect():
    print("Robot connected!")

@sio.event
def connect_error(data):
    print("Robot connection error: ", data)

@sio.event
def disconnect():
    print("Robot disconnected.")

print('Robot connected. SID: ', sio.sid)