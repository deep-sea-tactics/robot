import wrtc from "wrtc"
import { WebSocketServer } from 'ws';
import { sink } from "./render.js"
const { RTCPeerConnection, RTCIceCandidate } = wrtc

const port = 8080

console.log(`Listening on ${port}.`)

interface IncomingDataFormat {
  what: "call" | "answer" | "addIceCandidate",
  data: any
}

interface OutgoingDataFormat {
  what: "offer" | "iceCandidate",
  data: any
}

const wss = new WebSocketServer({
  port: 8080,
  path: "/stream/webrtc"
})

function sendIceCandidate(candidate: RTCIceCandidate, ws) {
  console.log("Sending ice candidate")
  const request: OutgoingDataFormat = {
    what: "iceCandidate",
    data: JSON.stringify({
      sdpMLineIndex: candidate.sdpMLineIndex,
      sdpMid: candidate.sdpMid,
      candidate: candidate.candidate
    })
  }

  ws.send(JSON.stringify(request))
}

wss.on('connection', async ws => {
  let remoteDescription

  const connection = new RTCPeerConnection()

  connection.oniceconnectionstatechange = function(){
    console.log('ICE state:', connection.iceConnectionState);
 }

  sink(connection)

  let iceCandidates = []

  connection.addEventListener("icecandidate", ({ candidate }) => {
    if (candidate && candidate.candidate) {

      if (!remoteDescription) {
        iceCandidates = [...iceCandidates, candidate]
        return
      }

      if (iceCandidates.length !== 0) {
        for (let candidateLoop of iceCandidates) {
          sendIceCandidate(candidateLoop, ws)
        }
      }

      sendIceCandidate(candidate, ws)
    } else {
      const request: OutgoingDataFormat = {
        what: "iceCandidate",
        data: null
      }
    
      ws.send(JSON.stringify(request))
    }
  })

  ws.on('message', async data => {
    const parsedData = JSON.parse(data.toString()) as IncomingDataFormat
    if (parsedData.what == "call") {
      console.log("Connection begins")
      const offer = await connection.createOffer()
      await connection.setLocalDescription(offer)
      const response: OutgoingDataFormat = {
        what: "offer",
        data: JSON.stringify(offer)
      }
      ws.send(JSON.stringify(response))
    } else if (parsedData.what == "answer") {
      remoteDescription = JSON.parse(parsedData.data)
      console.log("Received answer from peer")
      await connection.setRemoteDescription(remoteDescription)
    } else if (parsedData.what == "addIceCandidate") {
      console.log("Got ice candidate")
      const moreData = JSON.parse(parsedData.data)
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: moreData.sdpMLineIndex,
        sdpMid: moreData.sdpMid,
        candidate: moreData.candidate
      })

      if (remoteDescription) {
        await connection.addIceCandidate(candidate)
      }
    }
  })
});