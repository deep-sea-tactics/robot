<script lang="ts">

	import { Canvas, Layer } from "svelte-canvas";

	interface Position {
		x: number;
		y: number;
	}

	interface RenderInterface {
		context: CanvasRenderingContext2D
		width: number;
		height: number;
	}

	const mouseRadius = 10
	let canvas: Canvas
	let mousePos: Position = { x: canvas.width / 2, y: canvas.height / 2 }

	$: render = ({ context, width, height }: RenderInterface) => {

		const canvasOrigin: Position = {
			x: width / 2,
			y: height / 2
		}

		// Store the circle radius, useful for restricting the cursor
		const circleRadius = width / 2 - 10;

		// Create the circle (Last two arguments are in Radians)
		context.beginPath();
		context.arc(canvasOrigin.x, canvasOrigin.y, circleRadius, 0, 2 * Math.PI);
		context.stroke();

		// Create a circle around the mouse
		context.beginPath();
		context.arc(mousePos.x, mousePos.y, mouseRadius, 0, 2 * Math.PI);
		context.stroke();

		// Create a line between the center of the circle and the mouse's position
		context.beginPath();
		context.moveTo(canvasOrigin.x, canvasOrigin.y)
		context.lineTo(mousePos.x, mousePos.y);
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
	<button>Use Controller</button>
	<button>Use Mouse</button>
</div>

<style lang="scss">
	#controller {
		background-color: lightgray;
		grid-area: controller;
	}
</style>