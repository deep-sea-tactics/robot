import socketio
import aiortc
from aiortc import RTCPeerConnection, RTCSessionDescription

sio = socketio.Client()

sio.connect('http://localhost:9000')
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

rtcpc = RTCPeerConnection()

@sio.on('offer')
def offer(id,message):
    offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])

    

#need to use aiortc for connection

#	typings reference cuz same words used by socketio i think???
#
#	export interface ClientToServerMap {
#		controllerData: (data: ControllerData) => void;
#		/** A broadcaster is ready to broadcast */
#		broadcaster: () => void;
#		watcher: () => void;
#		offer: (id: string, message: RTCSessionDescription) => void;
#		answer: (id: string, message: RTCSessionDescription) => void;
#		candidate: (id: string, message: RTCIceCandidateInit) => void;
#	}
