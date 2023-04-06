<script lang="ts">
	import { onMount } from 'svelte';
	import CameraDisplay from './CameraDisplay.svelte';
	import { Receiver } from './streamer';

	let mediaStream: MediaStream;

	onMount(async () => {
		new Receiver(stream => (mediaStream = stream));
	});
</script>

<CameraDisplay {mediaStream} />
