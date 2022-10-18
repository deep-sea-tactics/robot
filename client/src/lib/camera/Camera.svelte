<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { screenshot } from '../screenshots/screenshots';
	import { captureVideoFrame } from 'capture-video-frame';
	import { page } from '$app/stores';

	export let port: number;

	let enabled = true;

	onMount(() => console.log($page.url));
	const signalling_server_address = '192.168.1.201:' + port;
	const pcConfig = {
		iceServers: [{ urls: ['stun:192.168.1.201:3478', 'stun:stun.l.google.com:19302'] }]
	};
	let video: HTMLVideoElement;
	let ws: WebSocket;
	let iceCandidates: RTCIceCandidateInit[] = [];
	let remoteDesc = false;
	let pc: RTCPeerConnection;

	function addIceCandidates() {
		Promise.all(iceCandidates.map((candidate) => pc.addIceCandidate(candidate)));
		iceCandidates = [];
	}

	function onTrack(event: RTCTrackEvent) {
		[video.srcObject] = event.streams;
	}

	function onIceCandidate(event: RTCPeerConnectionIceEvent) {
		if (event.candidate && event.candidate.candidate) {
			const candidate = {
				sdpMLineIndex: event.candidate.sdpMLineIndex,
				sdpMid: event.candidate.sdpMid,
				candidate: event.candidate.candidate
			};
			const request = {
				what: 'addIceCandidate',
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
			console.error('createPeerConnection() failed');
		}
	}

	function start() {
		enabled = true;
		document.documentElement.style.cursor = 'wait';

		const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
		ws = new WebSocket(protocol + '//' + signalling_server_address + '/stream/webrtc');

		ws.onopen = function () {
			iceCandidates = [];
			remoteDesc = false;
			createPeerConnection();
			const request = {
				what: 'call',
				options: {
					trickle_ice: true
				}
			};
			ws.send(JSON.stringify(request));
		};

		ws.onmessage = async function (evt) {
			const msg = JSON.parse(evt.data);
			if (msg.what === 'undefined') return;
			const { what, data } = msg;

			switch (what) {
				case 'offer': {
					await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(data)));
					remoteDesc = true;
					addIceCandidates();
					const sessionDescription = await pc.createAnswer();
					pc.setLocalDescription(sessionDescription);
					const request = {
						what: 'answer',
						data: JSON.stringify(sessionDescription)
					};
					ws.send(JSON.stringify(request));
					break;

				} case 'iceCandidate': { // when trickle is enabled
					if (!msg.data) {
						console.log('Ice Gathering Complete');
						break;
					}
					const elt = JSON.parse(msg.data);
					let candidate = new RTCIceCandidate({
						sdpMLineIndex: elt.sdpMLineIndex,
						candidate: elt.candidate
					});
					iceCandidates = [...iceCandidates, candidate];
					if (remoteDesc) addIceCandidates();
					document.documentElement.style.cursor = 'default';
					break;
				}
			}
		};

		ws.onclose = function () {
			if (pc) {
				pc.close();
				pc = null;
			}
			enabled = false;
			document.documentElement.style.cursor = 'default';
		};

		ws.onerror = function () {
			alert('An error has occurred! The cameras might be faulty on the hardware.');
			ws.close();
		};
	}

	function takeScreenshot() {
		$screenshot = captureVideoFrame('video', 'png').dataUri;
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
		enabled = false;
		document.documentElement.style.cursor = 'default';
	}

	onMount(() => {
		if (enabled) start();
	});

	onDestroy(() => {
		if (video && ws) {
			ws.onclose = function () { void 0 }; // disable onclose handler first
			stop();
		}
	});
</script>

<svelte:window
	on:keypress={(e) => {
		if (e.key == 's' && !document.activeElement) {
			takeScreenshot();
		}
	}}
/>

<div class="block h-full w-full bg-gray-200">
	{#if enabled}
		<video bind:this={video} id="video" autoplay class="h-full aspect-[4/3] object-cover">
			<track kind="captions" />
			Your browser does not support the video tag.
		</video>
		<button
			class="absolute bottom-0 bg-sky-500 px-4 py-2 hover:bg-sky-600 active:bg-sky-700"
			on:click={takeScreenshot}>Screenshot</button
		>
	{:else}
		<button class="bg-lime-500 px-4 py-2 hover:bg-lime-600 active:bg-lime-700" on:click={start}
			>Start {port}</button
		>
	{/if}
</div>
