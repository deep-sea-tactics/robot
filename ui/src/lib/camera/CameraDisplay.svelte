<script lang="ts">
	import { tick, onMount } from 'svelte';
	import consola from 'consola';

	let video: HTMLVideoElement;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;

	onMount(() => {
		const localContext = canvas.getContext('2d');
		if (!localContext) throw Error('No 2d context found. Weird?');
		context = localContext;
	});

	const processor = {
		timerCallback() {
			if (video?.paused || video?.ended) {
				return;
			}
			this.computeFrame();
			setTimeout(() => {
				this.timerCallback();
			}, 16); // NOTE i can only imagine the consequences of this
		},

		doLoad() {
			width = video.videoWidth;
			height = video.videoHeight;
			canvas.width = width;
			canvas.height = height;
			tick().then(() => this.timerCallback());
		},

		computeFrame() {
			context.drawImage(video, 0, 0, width, height);
			try {
				width = video.videoWidth;
				height = video.videoHeight;
				const frame = context.getImageData(0, 0, width, height);
				const l = frame.data.length / 4;

				context.putImageData(frame, 0, 0);
			} catch (e) {
				console.warn('Could not retrieve frame: ', e);
			}
		}
	};

	export let mediaStream: MediaStream;
	let classes = '';
	export let style = '';

	export { classes as class };

	let width = 0;
	let height = 0;

	function srcObject(node: HTMLVideoElement, stream: MediaStream) {
		consola.info('webrtc: Initially shovelling in stream:', stream);
		if (stream) {
			node.srcObject = stream;
		}
		return {
			update(newStream: MediaStream) {
				if (node.srcObject != newStream) {
					consola.info('webrtc: Shovelling in new stream:', newStream);
					node.srcObject = newStream;
					width = node.width;
					height = node.width;
				}
			}
		};
	}
</script>

{#if mediaStream}
	<video
		bind:this={video}
		bind:clientWidth={width}
		bind:clientHeight={height}
		style="display: none"
		use:srcObject={mediaStream}
		on:play={() => {
			width = video.width;
			height = video.height;
			processor.doLoad();
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

<canvas
	{style}
	{width}
	{height}
	class={classes}
	bind:this={canvas}
/>

<style>
	canvas {
		width: 100%;
	}
</style>
