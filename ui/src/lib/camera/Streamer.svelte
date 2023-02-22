<script lang="ts">
	import CameraDisplay from './CameraDisplay.svelte';

	let mediaStream: MediaStream;
</script>

<CameraDisplay {mediaStream} />
