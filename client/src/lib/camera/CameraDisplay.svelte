<script lang="ts">
	import { tick, onMount } from "svelte"

	let video: HTMLVideoElement
	let canvas: HTMLCanvasElement
	let context: CanvasRenderingContext2D
	
	onMount(() => {
		context = canvas.getContext("2d")!;
	})

	const processor = {
		timerCallback() {
			if (video?.paused || video.ended) {
				return;
			}
			this.computeFrame();
			setTimeout(() => {
				this.timerCallback();
			}, 16); // TODO haha this is a really bad idea oh my god
		},

		doLoad() {
			width = video.videoWidth;
			height = video.videoHeight;
			canvas.width = width;
			canvas.height = height;
			tick().then(() => this.timerCallback())
		},

		computeFrame() {
			context.drawImage(video, 0, 0, width, height);
			try {
				width = video.videoWidth;
				height = video.videoHeight;
				const frame = context.getImageData(0, 0, width, height);
				const l = frame.data.length / 4;

				for (let i = 0; i < l; i++) {
					const grey = (frame.data[i * 4 + 0] + frame.data[i * 4 + 1] + frame.data[i * 4 + 2]) / 3;

					frame.data[i * 4 + 0] = grey;
					frame.data[i * 4 + 1] = grey;
					frame.data[i * 4 + 2] = grey;
				}
				context.putImageData(frame, 0, 0);
			} catch (e) {
				 console.warn("Could not retrieve frame: ", e)
			}
		}
	};


	export let mediaStream: MediaStream;
	export let classes = '';

	export let width = 0;
	export let height = 0;

	function srcObject(node: HTMLVideoElement, stream: MediaStream) {
		node.srcObject = stream;
		return {
			update(newStream: MediaStream) {
				if (node.srcObject != newStream) {
					node.srcObject = newStream;

					(() => {
						width = node.width;
						height = node.width
					})

				}
			}
		};
	}
</script>

{width} {height}

<!-- svelte-ignore a11y-media-has-caption -->
<video
	bind:this={video}
	style="display: none"
	use:srcObject={mediaStream}
	on:play={() => {
		width = video.width;
		height = video.height;
		processor.doLoad()
	}}
	on:resize={() => {
		width = video.width;
		height = video.height
	}}
	autoplay
	playsinline
/>

<canvas class={classes} bind:this={canvas}></canvas>