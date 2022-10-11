<script lang="ts">
	import { tick } from "svelte"

	export let mediaStream: MediaStream;
	export let previewHeight = '';
	export let previewWidth = '';
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
	class={classes}
	use:srcObject={mediaStream}
	width={previewWidth}
	height={previewHeight}
	autoplay
	playsinline
/>
