<script lang="ts">
	import consola from 'consola';
    import { onMount } from 'svelte';

	let video: HTMLVideoElement;

	export let mediaStream: MediaStream;

	let width = 0;
	let height = 0;

	function srcObject(node: HTMLVideoElement, stream: MediaStream) {
		consola.info('webrtc: Initially shovelling in stream:', stream);
		if (stream) {
			onMount(() => {
				node.srcObject = stream;
				width = node.width;
				height = node.height;
			})
		}
		return {
			update(newStream: MediaStream) {
				if (node.srcObject != newStream) {
					consola.info('webrtc: Shovelling in new stream:', newStream);
					node.srcObject = newStream;
					width = node.width;
					height = node.height;
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
		use:srcObject={mediaStream}
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
