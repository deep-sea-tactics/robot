<script lang="ts">
	import CameraDisplay from '$lib/camera/CameraDisplay.svelte';
	import ControllerCanvas from '$lib/controller/ControllerCanvas.svelte';
	import { data } from '$lib/controller/controller';
	import { client } from '$lib/socket/socket';
	import consola from 'consola';

	import WindowComponent from '$lib/windowing/WindowComponent.svelte';
	import Taskbar from '$lib/windowing/Taskbar.svelte';
	import { onDestroy } from 'svelte';
	import { config } from '$lib/socket/webrtc';

	let mediaStream: MediaStream;

	$: if ($data) client.emit(`controllerData`, $data);

	let peerConnection: RTCPeerConnection;
	let candidates: RTCIceCandidate[] = [];
	let answered = false;

	client.on('offer', (id, description) => {
		consola.info(`offered by ${id}:`, description);
		answered = true;
		peerConnection = new RTCPeerConnection(config);
		peerConnection
			.setRemoteDescription(description)
			.then(() => peerConnection.createAnswer())
			.then(sdp => peerConnection.setLocalDescription(sdp))
			.then(() => {
				consola.info(`Sending answer to peer ${id}`);
				client.emit('answer', id, peerConnection.localDescription!);
			});

		peerConnection.addEventListener('icecandidate', event => {
			if (event.candidate) {
				client.emit('candidate', id, event.candidate);
			}
		});

		peerConnection.addEventListener('track', event => {
			consola.info('Found Track: ', event.streams[0]);
			mediaStream = event.streams[0];
		});

		for (const candidate of candidates) {
			consola.info('Adding stored candidate', candidate);
			peerConnection.addIceCandidate(candidate);
		}
	});
	client.on('candidate', (id, candidate) => {
		consola.info(`Received candidate from ${id}`, candidate);
		if (answered) {
			peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
		} else {
			candidates.push(new RTCIceCandidate(candidate));
		}
	});

	client.on('connect', () => {
		client.emit('watcher');
	});

	client.on('broadcaster', () => {
		client.emit('watcher');
	});

	onDestroy(() => {
		client.close();
		peerConnection.close();
	});
</script>

<svelte:window
	on:keydown={event => {
		if (event.key == 'ArrowUp') {
			// do something
		}
	}}
/>

<main>
	<Taskbar>
		<WindowComponent
			windowName="video"
			height={400}
			width={400}
			color="#E1CE7A"
			x={300}
			open={false}
		>
			<CameraDisplay {mediaStream} />
		</WindowComponent>
		<WindowComponent
			color="#72E1D1"
			windowName="keybinds"
			height={200}
			width={200}
		>
			<div class="keybinds-wrap">
				<div class="keybinds-holder">
					<!-- <Icon data={arrowUp} />
					<p>Some action</p> -->
				</div>
			</div>
		</WindowComponent>
		<WindowComponent
			windowName="visualizer"
			color="#E58F65"
			height={200}
			width={200}
			y={300}
		>
			<ControllerCanvas />
		</WindowComponent>
	</Taskbar>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		background-color: white;
	}

	.keybinds-holder {
		flex-wrap: nowrap;
		display: flex;
		justify-content: left;
		align-items: center;
		text-align: left;
		margin: 5px;
	}
	/* .keybinds-holder p {
		margin-left: 10px;
		flex-grow: 1;
		flex-shrink: 1;
	} */
</style>
