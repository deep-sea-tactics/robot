<script lang="ts">

	import { onMount } from 'svelte'

	let canvas: HTMLCanvasElement;

	onMount(() => {
		let context = canvas.getContext("2d")

		// Store the circle radius, useful for restricting the cursor
		const circleRadius = canvas.width / 2 - 10;

		// Create the circle (Last two arguments are in Radians)
		context.beginPath();
		context.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, 2 * Math.PI);
		context.stroke();
	})
</script>

<div id="controller">
	<canvas bind:this={canvas} width=300 height=300></canvas>
</div>

<style lang="scss">
	#controller {
		background-color: lightgray;
		grid-area: controller;
	}
</style>