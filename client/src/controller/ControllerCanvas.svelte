<script lang="ts">

	import { Canvas, Layer } from "svelte-canvas";
	import { position, trigger } from './controller'
	import type { Position, RenderInterface } from './typings'

	const mouseRadius = 10

	let canvasWidth: number = 300

	$: render = ({ context, width, height }: RenderInterface) => {

		const canvasOrigin: Position = {
			x: width / 2,
			y: height / 2
		}

		const translatedPosition: Position = {
      		x: ($position.x) * (width / 100),
			y: ($position.y) * (height / 100)
    	}

		// Grid
		for (let x = 0; x <= width; x += width / 10) {
			context.moveTo(0.5 + x, 0);
			context.lineTo(0.5 + x, height);
		}

		for (let x = -1; x <= width - 1; x += width / 10) {
			context.moveTo(0, 0.5 + x);
			context.lineTo(height, 0.5 + x);
		}

		context.strokeStyle = "#aaa";
		context.stroke();

		// Base stroke style
		context.strokeStyle = `rgb(50, 168, 96)`
		context.fillStyle = `rgb(50, 168, 96)`

		// Create a line between the center of the circle and the mouse's position
		context.beginPath();
		context.moveTo(canvasOrigin.x, canvasOrigin.y)
		context.lineTo(translatedPosition.x, translatedPosition.y);
		context.stroke();

		// Create an origin circle
		context.beginPath();
		context.arc(canvasOrigin.x, canvasOrigin.y, mouseRadius / 2, 0, 2 * Math.PI);
		context.fill();

		context.strokeStyle = "black"
		context.fillStyle = "black"

		// Create a circle around the mouse
		context.beginPath();
		context.arc(translatedPosition.x, translatedPosition.y, mouseRadius, 0, 2 * Math.PI);

		if ($trigger) 
			context.fill();
		else 
			context.stroke();

	}

</script>

<div class="bg-gray-300" bind:clientWidth={canvasWidth}>
	<Canvas width={canvasWidth} height={canvasWidth}>
		<Layer {render}></Layer>
	</Canvas>
</div>