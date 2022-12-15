import socketio
import sys
from aiortc import RTCPeerConnection, RTCSessionDescription

sio = socketio.Client()

print("attempting connection with server...")


@sio.event
def connect():
    print("Connected to socket.io server! beginning broadcast...")
    sio.emit('broadcaster')


@sio.event
def connect_error(data):
    print("The connection failed!")


@sio.event
def disconnect():
    print("broadcaster disconnected :(")


@sio.on('broadcaster')
def broadcaster():
    print("Ready to broadcast!")


@sio.event
def offer(id, message):
    print("Received offer")
    # offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])


@sio.on('watcher')
def watcher(id):
    print("Received watcher")


if __name__ == "__main__":
    sio.connect('http://localhost:3000')
