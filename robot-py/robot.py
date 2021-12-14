import socketio

# standard Python
sio = socketio.Client()

sio.connect("http://192.168.1.202")

@sio.on('position')
def on_message(data):
    print(data)

print('Robot connected. SID: ', sio.sid)