<script lang="ts">
	import { onDestroy } from 'svelte';
	import CameraDisplay from '$lib/camera/CameraDisplay.svelte';

	let stream: MediaStream;
	let canvas: HTMLCanvasElement;

	onDestroy(() => {
		if (!stream) return;
		for (const track of [...stream.getTracks()]) {
			track.stop();
			stream.removeTrack(track);
		}
	});
</script>

<canvas bind:this={canvas} />

{#if stream}
	<div class="m-16 bg-gray-100 flex flex-col p-8 rounded-lg shadow-lg">
		<CameraDisplay mediaStream={stream} />
		<div class="h-1/2 grow">
			<p>Streaming Status</p>
		</div>
	</div>
{/if}
