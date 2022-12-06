import socketio
import sys
from loguru import logger
from aiortc import RTCPeerConnection, RTCSessionDescription
logger.remove()
logger.add(sys.stderr, format="{level} <blue>{message}</blue>", level="INFO")

sio = socketio.Client()
sio.connect('http://localhost:9000')

logger.info("attempting connection with server...")


@sio.event
def connect():
	logger.info("Connected to socket.io server! beginning broadcast...")
	sio.emit('broadcaster')

@sio.event
def connect_error(data):
	logger.warn("The connection failed!")
 

@sio.event
def disconnect():
	logger.warn("broadcaster disconnected :(")


@sio.on('offer')
def offer(id, message):
	logger.info("Received offer")
	#offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])
