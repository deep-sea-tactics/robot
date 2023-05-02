<script lang="ts">
	import consola from 'consola';
	import { onMount } from 'svelte';

	let video: HTMLVideoElement;

	export let mediaStream: MediaStream;

	let width = 0;
	let height = 0;

	$: {
		if (video && mediaStream) {
			consola.info('webrtc: Shovelling in stream:', mediaStream);
			video.srcObject = mediaStream;
			width = video.width;
			height = video.height;
		}
	}

	onMount(() => {
		if (video && mediaStream) {
			consola.info('webrtc: Shovelling in mount stream:', mediaStream);
			video.srcObject = mediaStream;
			width = video.width;
			height = video.height;
		}
	});
</script>

{#if mediaStream}
	<video
		bind:this={video}
		bind:clientWidth={width}
		bind:clientHeight={height}
		on:play={() => {
			width = video.width;
			height = video.height;
		}}
		on:resize={() => {
			width = video.width;
			height = video.height;
		}}
		autoplay
		playsinline
	>
		<track kind="captions" />
	</video>
{/if}

<style>
	video {
		transform: scaleY(-1);
	}
</style>

