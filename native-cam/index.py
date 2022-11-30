import socketio
import aiortc
sio = socketio.Client()
from aiortc import RTCPeerConnection, RTCSessionDescription

sio.connect('http://localhost:3000')

@sio.on('connect')
def connectedToServer():
	sio.emit('broadcaster', {'foo': 'bar'})

rtcpc = RTCPeerConnection()

@sio.event
def candidate(id,message):
	rtcpc.addIceCandidate(message)

@sio.event
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