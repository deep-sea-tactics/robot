import socketio
import asyncio
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaPlayer
from aiortc.sdp import candidate_from_sdp
from typing import Dict

# Set up media relay
socketClient = socketio.AsyncClient()
player = MediaPlayer('../videos/robert.mp4')

# Subscribe to the video (creates the media tracts)
video = player.video

# pairs of SocketIO ids to their respective PeerConnections
peerConnections: Dict[str, RTCPeerConnection] = {}


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
async def candidate(id, candidate):
    print(f"Received ice candidate: {candidate}")
    if len(candidate["candidate"]) == 0:
        return

    iceCandidate = candidate_from_sdp(candidate["candidate"].split(":", 1)[1])
    iceCandidate.sdpMid = candidate["sdpMid"]
    iceCandidate.sdpMLineIndex = candidate["sdpMLineIndex"]

    peerConnection = peerConnections[id]
    await peerConnection.addIceCandidate(iceCandidate)


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
            if not peerConnections.has_key(peerConnection):
                return
            await peerConnection.close()
            del peerConnections[peerConnection]
        elif peerConnection.connectionState == "connected":
            print(peerConnection.sctp)

    @peerConnection.on("iceconnectionstatechange")
    async def on_iceconnectionstatechange():
        print("ICE Connection state is %s" % peerConnection.iceConnectionState)
        if peerConnection.iceConnectionState == "failed":
            if not peerConnections.has_key(peerConnection):
                print("Peer connection not found")
                return
            print("Closing peer connection due to ICE failure")
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

    @peerConnection.on('icegatheringstatechange')
    async def on_icegatheringstatechange():
        print(f'iceGatheringState changed: {peerConnection.iceGatheringState}')
        if peerConnection.iceGatheringState == 'complete':
            if peerConnection.sctp is None:
                print("SCTP is not ready yet")
                return

            # candidates are ready
            transport = peerConnection.sctp.transport.transport
            iceCandidates = transport.iceGatherer.getLocalCandidates()
            for iceCandidate in iceCandidates:
                print(f"Sending ice candidate: {iceCandidate}")
                candidate = {
                    "candidate": iceCandidate.candidate,
                    "sdpMid": iceCandidate.sdpMid,
                    "sdpMLineIndex": iceCandidate.sdpMLineIndex
                }
                print(f"Sending ice candidate: {candidate}")
                await socketClient.emit("candidate", (id, candidate))


async def main():
    print("attempting connection with server...")
    await socketClient.connect('http://localhost:3000')
    await socketClient.wait()

if __name__ == "__main__":
    asyncio.run(main())
