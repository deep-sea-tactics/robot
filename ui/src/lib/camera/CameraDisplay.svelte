<script lang="ts">
	import consola from 'consola';
	import { onMount } from 'svelte';

	let maxHeight = 0;
	let maxWidth = 0;
	let trueHeight = 0;
	let trueWidth = 0;
	$: trueHeight = Math.min(maxHeight, maxWidth * (9 / 16));
	$: trueWidth = (trueHeight * 16) / 9;

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

<svelte:window
	on:keydown={event => {
		if (event.key == 'k') {
			// take a screenshot
			if (!mediaStream) {
				console.error('Triggered screenshot, but no media stream found');
				return;
			};

			const videoTrack = mediaStream.getVideoTracks()[0];
			if (!videoTrack) {
				console.error('Triggered screenshot, but no video track found');
				return;
			}

			const { width, height } = videoTrack.getSettings();

			const canvas = document.createElement('canvas');
			canvas.width = width ?? 0;
			canvas.height = height ?? 0;


			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.translate(canvas.width, canvas.height);
			ctx.scale(-1, -1);
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);


			// save the screenshot
			const link = document.createElement('a');
			link.download = 'screenshot.png';
			link.href = canvas.toDataURL();
			link.click();

			// free the canvas
			canvas.remove();

		}
	}}
/>

<div
	class="wrap"
	bind:clientHeight={maxHeight}
	bind:clientWidth={maxWidth}
>
	<div
		class="subtest"
		style="height: {trueHeight}px; width: {trueWidth}px;"
	>
		{#if mediaStream}
			<video
				bind:this={video}
				width={trueWidth}
				height={trueHeight}
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
	</div>
</div>

<style>
	.wrap {
		height: 100%;
		width: 100%;
		max-height: 100%;
		aspect-ratio: 16 / 9;
		display: flex;
		justify-content: center;
		align-items: center;
		background: black;
	}
	.subtest {
		width: 100%;
		aspect-ratio: 16 / 9;
	}
	video {
		transform: scaleY(-1) scaleX(-1);
	}
</style>
