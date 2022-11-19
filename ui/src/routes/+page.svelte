<script lang="ts">
	import CameraDisplay from '$lib/camera/CameraDisplay.svelte';
	import ControllerCanvas from '$lib/controller/ControllerCanvas.svelte';
	import Icon from 'svelte-awesome';
	import arrowLeft from 'svelte-awesome/icons/arrowLeft';
	import arrowRight from 'svelte-awesome/icons/arrowRight';
	import arrowUp from 'svelte-awesome/icons/arrowUp';
	import { client } from '$lib/socket/socket';
	import type { ControllerData } from 'landstown-robotics-types';
	import consola from 'consola';

	import WindowComponent from '$lib/windowing/WindowComponent.svelte';
	import Taskbar from '$lib/windowing/Taskbar.svelte';
	import { onDestroy } from 'svelte';

	let mediaStream: MediaStream;

	const bool = (num: number) => num !== 0;
	function buf2hex(buffer: ArrayBuffer) {
		return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
	}
	function processData(view: DataView): ControllerData {
		const rawData = buf2hex(view.buffer).match(/..?/g);
		if (rawData == null) throw Error('No data?');
		const parsedRawData = rawData.map(item => parseInt(item, 16));
		return {
			position: {
				x: (((parsedRawData[1] & 0x03) << 8) + parsedRawData[0]) / 10.24,
				y: (((parsedRawData[2] & 0x0f) << 6) + ((parsedRawData[1] & 0xfc) >> 2)) / 10.24
			},
			yaw: parsedRawData[3],
			view: (parsedRawData[2] & 0xf0) >> 4,
			throttle: -parsedRawData[5] + 255,
			buttons: {
				trigger: bool((parsedRawData[4] & 0x01) >> 0),
				side_grip: bool((parsedRawData[4] & 0x02) >> 1),
				controller_buttons: {
					bottom_left: bool((parsedRawData[4] & 0x04) >> 2),
					bottom_right: bool((parsedRawData[4] & 0x08) >> 3),
					top_left: bool((parsedRawData[4] & 0x10) >> 4),
					top_right: bool((parsedRawData[4] & 0x20) >> 5)
				},
				side_panel: {
					bottom_left: bool((parsedRawData[4] & 0x40) >> 6),
					top_left: bool((parsedRawData[4] & 0x80) >> 7),
					bottom_middle: bool((parsedRawData[6] & 0x01) >> 0),
					top_middle: bool((parsedRawData[6] & 0x02) >> 1),
					bottom_right: bool((parsedRawData[6] & 0x04) >> 2),
					top_right: bool((parsedRawData[6] & 0x08) >> 3)
				}
			}
		};
	}
	let dataBuffer: DataView;
	$: processedData = dataBuffer ? processData(dataBuffer) : null;
	async function openController() {
		if (!navigator.hid) return;
		const hid = navigator.hid;
		const [device] = await hid.requestDevice({
			filters: [
				{
					vendorId: 1133,
					productId: 49685
				}
			]
		});

		await device.open();
		device.addEventListener('inputreport', ({ data }) => {
			dataBuffer = data;
		});
	}

	$: if (processedData) client.emit(`clientControllerData`, processedData);

	let peerConnection: RTCPeerConnection;
	let candidates: RTCIceCandidate[] = [];
	let answered = false;
	const config = {
		iceServers: [
			{
				urls: ['stun:stun.l.google.com:19302']
			}
		]
	};

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
			openController();
		}
	}}
/>

<main class="w-screen h-screen">
	<!--Key Binds-->

	<Taskbar />
	<div class="primary-container">
		<WindowComponent
			windowName="video"
			height={200}
			width={200}
		>
			<CameraDisplay
				{mediaStream}
				name="Cam"
			/>
		</WindowComponent>
		<WindowComponent
			windowName="keybinds"
			height={200}
			width={200}
		>
			<div class="keybinds-wrap">
				<div class="keybinds-holder">
					<Icon data={arrowUp} />
					<p>Enable Controller</p>
				</div>
			</div>
		</WindowComponent>
		<WindowComponent
			windowName="visualizer"
			height={200}
			width={200}
		>
			<ControllerCanvas />
		</WindowComponent>
	</div>
</main>

<style>
	.keybinds-holder {
		flex-wrap: nowrap;
		display: flex;
		justify-content: left;
		align-items: center;
		text-align: left;
		margin: 5px;
	}
	.keybinds-holder p {
		margin-left: 10px;
		flex-grow: 1;
		flex-shrink: 1;
	}
	.primary-container {
		width: calc(100% - 4rem);
		height: calc(100% - 4rem);
		margin: 2rem;
	}
</style>
