<script lang="ts">
	export let mediaStream: MediaStream;
	export let previewHeight = '';
	export let previewWidth = '';
	export let classes = '';

	function srcObject(node: HTMLVideoElement, stream: MediaStream) {
		node.srcObject = stream;
		return {
			update(newStream: MediaStream) {
				if (node.srcObject != newStream) {
					node.srcObject = newStream;
				}
			}
		};
	}
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
	class={classes}
	use:srcObject={mediaStream}
	width={previewWidth}
	height={previewHeight}
	autoplay
	playsinline
/>
