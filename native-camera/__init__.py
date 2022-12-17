import socketio
import asyncio
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaPlayer, MediaRelay
from typing import Dict

# Set up media relay
socketClient = socketio.AsyncClient()
player = MediaPlayer('../videos/robert.mp4')
relay = MediaRelay()

# Subscribe to the video (creates the media tracts)
video = relay.subscribe(player.video)

# pairs of SocketIO ids to their respective PeerConnections
peerConnections: Dict[str, RTCPeerConnection] = dict()


@socketClient.event
async def connect():
    print("Connected to socket.io server! beginning broadcast...")
    await socketClient.emit('broadcaster')


@socketClient.event
async def connect_error(data):
    print("The connection failed!")


@socketClient.event
async def disconnect():
    print("Self disconnected.")


@socketClient.event
async def answer(id, message):
    print("Received answer")
    answer = RTCSessionDescription(sdp=message["sdp"], type=message["type"])
    peerConnection = peerConnections[id]

    await peerConnection.setRemoteDescription(answer)


@socketClient.on('watcher')
async def watcher(id):
    # create the peer connection
    peerConnection = RTCPeerConnection()
    peerConnections[id] = peerConnection
    print("Received offer and created peer connection")

    # DEBUG: notify for state changes
    @peerConnection.on("connectionstatechange")
    async def on_connectionstatechange():
        print("Connection state is %s" % peerConnection.connectionState)
        if peerConnection.connectionState == "failed":
            await peerConnection.close()
            del peerConnections[peerConnection]

    # connect the video tracks to this peer connection
    peerConnection.addTrack(video)

    # create an offer
    offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    # send it out with the ID pair
    await socketClient.emit("offer", (id, {
        "sdp": peerConnection.localDescription.sdp,
        "type": peerConnection.localDescription.type
    }))


async def main():
    print("attempting connection with server...")
    await socketClient.connect('http://localhost:3000')
    await socketClient.wait()

if __name__ == "__main__":
    asyncio.run(main())
