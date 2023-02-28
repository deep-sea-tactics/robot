<script lang="ts">
	import { onMount } from 'svelte';
	import CameraDisplay from './CameraDisplay.svelte';
	import { WebRtcStreamer } from './streamer';

	const url = 'http://0.0.0.0:8000';

	const mediaConstraints: RTCOfferOptions = {
		offerToReceiveAudio: false,
		offerToReceiveVideo: true
	};

	let iceServers: RTCConfiguration;
	let pc: RTCPeerConnection;
	let peerID = Math.random();
	let deviceList: string[];
	let earlyCandidates: RTCIceCandidate[] = [];
	let mediaStream: MediaStream;

	onMount(async () => {
		iceServers = await fetch(url + '/api/getIceServers').then(res => res.json());
		deviceList = await fetch(url + '/api/getVideoDeviceList').then(res => res.json());

		const usbDevice = deviceList.find(device => device.includes('USB'));

		if (!usbDevice) {
			console.error('No USB device found');
			return;
		}

		const streamer = new WebRtcStreamer(stream => (mediaStream = stream), url);

		streamer.connect(usbDevice);
	});
</script>

<CameraDisplay {mediaStream} />
