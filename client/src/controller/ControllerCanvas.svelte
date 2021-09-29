<script lang="ts">
	let canvas: HTMLCanvasElement;
</script>

<div id="controller">
	<canvas bind:this={canvas} width=100 height=100></canvas>
</div>

<style lang="scss">
	#controller {
		grid-area: controller;
	}
</style>