<script lang="ts">

	import { Canvas, Layer, t, getCanvas } from "svelte-canvas";

	interface MousePos {
		x: number;
		y: number;
	}

	let canvas: Canvas
	let mousePos: MousePos = { x: 0, y: 0 }

	$: render = ({ context, width, height }) => {
		// Store the circle radius, useful for restricting the cursor
		const circleRadius = width / 2 - 10;

		// Create the circle (Last two arguments are in Radians)
		context.beginPath();
		context.arc(width / 2, height / 2, circleRadius, 0, 2 * Math.PI);
		context.stroke();

		context.beginPath();
		context.arc(mousePos.x, mousePos.y, 10, 0, 2 * Math.PI);
		context.stroke();
	}

	function mouseEvent({ clientX, clientY } : MouseEvent) {
		const rect = canvas.getCanvas().getBoundingClientRect();

		mousePos = {
			x: clientX - rect.left,
			y: clientY - rect.top
		};
	}
</script>

<div id="controller">
	<Canvas bind:this={canvas} on:mousemove={mouseEvent} width={300} height={300}>
		<Layer {render}></Layer>
	</Canvas>
</div>

<style lang="scss">
	#controller {
		background-color: lightgray;
		grid-area: controller;
	}
</style>