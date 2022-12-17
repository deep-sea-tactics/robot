import socketio
import asyncio
from aiortc import RTCPeerConnection
from aiortc.contrib.media import MediaPlayer, MediaRelay

sio = socketio.AsyncClient()
player = MediaPlayer('../videos/robert.mp4')
relay = MediaRelay()

video = relay.subscribe(player.video)

peerConnections = set()

@sio.event
async def connect():
    print("Connected to socket.io server! beginning broadcast...")
    await sio.emit('broadcaster')


@sio.event
async def connect_error(data):
    print("The connection failed!")


@sio.event
async def disconnect():
    print("broadcaster disconnected :(")


@sio.event
async def answer(id, message):
    print("Received answer")
    # offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])


@sio.on('watcher')
async def watcher(id):
    peerConnection = RTCPeerConnection()
    peerConnections.add(peerConnection)
    print("Received offer and created peer connection")

    @peerConnection.on("connectionstatechange")
    async def on_connectionstatechange():
        print("Connection state is %s" % peerConnection.connectionState)
        if peerConnection.connectionState == "failed":
            await peerConnection.close()
            peerConnections.discard(peerConnection)

    peerConnection.addTrack(video)

    offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    await sio.emit("offer", {
        "sdp": peerConnection.localDescription.sdp,
        "type": peerConnection.localDescription.type
    })


async def main():
    print("attempting connection with server...")
    await sio.connect('http://localhost:3000')
    await sio.wait()

if __name__ == "__main__":
    asyncio.run(main())
