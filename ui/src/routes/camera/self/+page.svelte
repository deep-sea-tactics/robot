<script lang="ts">
	import { onDestroy } from 'svelte';
	import { client } from '$lib/socket/socket';
	import CameraDisplay from '$lib/camera/CameraDisplay.svelte';
	import consola from 'consola';
	import { config } from '$lib/socket/webrtc';
	import { Moon } from 'svelte-loading-spinners';

	let stream: MediaStream;

	const peerConnections: {
		[key: string]: {
			connection: RTCPeerConnection;
			candidates: RTCIceCandidate[];
			answered: boolean;
		};
	} = {};

	client.on('watcher', id => {
		const peerConnection = new RTCPeerConnection(config);
		peerConnections[id] = { connection: peerConnection, candidates: [], answered: false };

		for (const track of stream.getTracks()) {
			peerConnection.addTrack(track, stream);
		}

		peerConnection.addEventListener('icecandidate', event => {
			if (event.candidate) {
				client.emit('candidate', id, event.candidate);
			}
		});

		peerConnection
			.createOffer()
			.then(sdp => peerConnection.setLocalDescription(sdp))
			.then(() => {
				client.emit('offer', id, peerConnection.localDescription!);
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

	client.on('disconnectPeer', id => {
		peerConnections[id].connection.close();
		delete peerConnections[id];
	});

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
			throw new Error('No camera found');
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
	<div class="spinner">
		<h1>Waiting for camera access...</h1>
		<br />
		<Moon
			size="60"
			color="#FF3E00"
			unit="px"
			duration="1s"
		/>
	</div>
{:then mediaStream}
	<div class="video-container">
		<CameraDisplay
			style="box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 2px black; border-radius: 1rem;"
			{mediaStream}
		/>
		<div class="streaming-status">
			<p>Streaming Status</p>
		</div>
	</div>
{/await}

<style lang="scss">
	// move spinner to center
	.spinner {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	h1 {
		font-size: 2rem;
		color: #ff3e00;
		margin-bottom: 1rem;
	}

	.video-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
</style>
