import socketio

# standard Python
sio = socketio.Client()

@sio.on('position')
def on_message(data):
    print('data')