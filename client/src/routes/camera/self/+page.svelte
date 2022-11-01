<script lang="ts">
	import { onDestroy } from 'svelte';
	import { client } from '$lib/socket/socket';
	import CameraDisplay from '$lib/camera/CameraDisplay.svelte';
	import consola from 'consola';

	let stream: MediaStream;

	const peerConnections: {
		[key in string]: {
			connection: RTCPeerConnection;
			candidates: RTCIceCandidate[];
			answered: boolean;
		};
	} = {};

	client.on('watcher', (id) => {
		const peerConnection = new RTCPeerConnection(config);
		peerConnections[id] = { connection: peerConnection, candidates: [], answered: false };

		for (const track of stream.getTracks()) {
			peerConnection.addTrack(track, stream);
		}

		peerConnection.addEventListener('icecandidate', (event) => {
			if (event.candidate) {
				client.emit('candidate', id, event.candidate);
			}
		});

		peerConnection
			.createOffer()
			.then((sdp) => peerConnection.setLocalDescription(sdp))
			.then(() => {
				client.emit('offer', id, peerConnection.localDescription);
			});
	});

	client.on('answer', (id, description) => {
		consola.info(`Received answer from ${id}:`, description);
		peerConnections[id].connection.setRemoteDescription(description);
		peerConnections[id].answered = true;
		for (const candidate of peerConnections[id].candidates) {
			consola.info('Sending out stored candidates');
			peerConnections[id].connection.addIceCandidate(candidate);
		}
	});

	client.on('candidate', (id, candidate) => {
		consola.info(`Receiving candidate from ${id}:`, candidate);
		if (peerConnections[id].answered) {
			peerConnections[id].connection.addIceCandidate(new RTCIceCandidate(candidate));
		} else {
			peerConnections[id].candidates.push(new RTCIceCandidate(candidate));
		}
	});

	client.on('disconnectPeer', (id) => {
		peerConnections[id].connection.close();
		delete peerConnections[id];
	});

	const config = {
		iceServers: [
			{
				urls: ['stun:stun.l.google.com:19302']
			}
		]
	};

	async function getMedia(): Promise<MediaStream> {
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: true
			});

			client.emit('broadcaster');

			return stream;
		} catch (err) {
			alert(err);
			throw 'NO camera found';
		}
	}

	onDestroy(() => {
		if (!stream) return;
		for (const track of [...stream.getTracks()]) {
			track.stop();
			stream.removeTrack(track);
		}
		client.close();
	});
</script>

{#await getMedia()}
	<p>Waiting for Camera</p>
{:then mediaStream}
	<div class="m-16 bg-gray-100 flex flex-col p-8 rounded-lg shadow-lg">
		<CameraDisplay {mediaStream} name="Camera Self" />
		<div class="h-1/2 grow">
			<p>Streaming Status</p>
		</div>
	</div>
{/await}
