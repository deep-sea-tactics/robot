import socketio
import aiortc
sio = socketio.Client()

sio.connect('http://localhost:3000')

sio.emit('broadcaster', {'foo': 'bar'})
#need to use aiortc for connection stuff