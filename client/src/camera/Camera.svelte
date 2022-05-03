
<script lang="ts">
	import { onMount } from "svelte";

	export let port: number

	const signalling_server_address = "192.168.1.201:" + port;
	const pcConfig = {"iceServers": [{"urls": ["stun:stun.l.google.com:19302"]}]};
	let startButton: HTMLButtonElement
	let stopButton: HTMLButtonElement
	let video: HTMLVideoElement
	let ws: WebSocket;
	let iceCandidates: RTCIceCandidateInit[] = []
	let remoteDesc = false;
	let pc: RTCPeerConnection;

	function addIceCandidates() {
		iceCandidates.forEach(candidate => {
			pc.addIceCandidate(candidate)
		});
		iceCandidates = [];
	}

	function onTrack(event) {
		video.srcObject = event.streams[0];
	}

	function onIceCandidate(event) {
		if (event.candidate && event.candidate.candidate) {
			const candidate = {
				sdpMLineIndex: event.candidate.sdpMLineIndex,
				sdpMid: event.candidate.sdpMid,
				candidate: event.candidate.candidate
			};
			const request = {
				what: "addIceCandidate",
				data: JSON.stringify(candidate)
			};
			ws.send(JSON.stringify(request));
		}
	}

	function createPeerConnection() {
		try {
			pc = new RTCPeerConnection(pcConfig);
			pc.onicecandidate = onIceCandidate;
			pc.ontrack = onTrack;
		} catch (e) {
			console.error("createPeerConnection() failed");
		}
	}

	function start() {
		stopButton.disabled = false;
		startButton.disabled = true;
		document.documentElement.style.cursor = 'wait';

		const protocol = location.protocol === "https:" ? "wss:" : "ws:";
		ws = new WebSocket(protocol + '//' + signalling_server_address + '/stream/webrtc');

		ws.onopen = function () {
			iceCandidates = [];
			remoteDesc = false;
			createPeerConnection();
			var request = {
				what: "call",
				options: {
					trickle_ice: true
				}
			};
			ws.send(JSON.stringify(request));
		};

		ws.onmessage = function (evt) {
			const msg = JSON.parse(evt.data);
			if (msg.what === "undefined") return
			const { what, data } = msg

			switch (what) {
				case "offer":
					pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(data)),
							function onRemoteSdpSuccess() {
								remoteDesc = true;
								addIceCandidates();
								pc.createAnswer(function (sessionDescription) {
									pc.setLocalDescription(sessionDescription);
									const request = {
										what: "answer",
										data: JSON.stringify(sessionDescription)
									};
									ws.send(JSON.stringify(request));

								}, function (error) {
									alert("Failed to createAnswer: " + error);

								});
							},
							function onRemoteSdpError(event) {
								alert('Failed to set remote description (unsupported codec on this browser?): ' + event);
								stop();
							}
					);
					
					break;

				case "iceCandidate": // when trickle is enabled
					if (!msg.data) {
						console.log("Ice Gathering Complete");
						break;
					}
					var elt = JSON.parse(msg.data);
					let candidate = new RTCIceCandidate({sdpMLineIndex: elt.sdpMLineIndex, candidate: elt.candidate});
					iceCandidates.push(candidate);
					if (remoteDesc)
						addIceCandidates();
					document.documentElement.style.cursor = 'default';
					break;
			}
		};

		ws.onclose = function () {
			if (pc) {
				pc.close();
				pc = null;
			}
			stopButton.disabled = true;
			startButton.disabled = false;
			document.documentElement.style.cursor = 'default';
		};

		ws.onerror = function (evt) {
			alert("An error has occurred!" + evt);
			ws.close();
		};
	}

	function stop() {
		video.srcObject = null;
		video.src = ''; // TODO; remove
		if (pc) {
			pc.close();
			pc = null;
		}
		if (ws) {
			ws.close();
			ws = null;
		}
		stopButton.disabled = true;
		startButton.disabled = false;
		document.documentElement.style.cursor = 'default';
		console.log(1)
	}

	onMount(() => {
		window.onbeforeunload = function () {
			if (ws) {
				ws.onclose = function () {}; // disable onclose handler first
				stop();
			}
		};
	});
</script>
<style>
	video {
		border: 1px solid #aaa;
	}
</style>
<div class="overlayWrapper">
	<video bind:this={video} id="remote-video" autoplay width="640" height="480">
		<track kind="captions"/>
		Your browser does not support the video tag.
	</video>
</div>
<div id="controls">
	<button id="start" bind:this={startButton} style="background-color: green;" on:click={start}>Start</button>
	<button disabled id="stop" bind:this={stopButton} style="background-color: red" on:click={stop}>Stop</button>
</div>
<br>