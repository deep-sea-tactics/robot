<script lang="ts">

	import { Canvas, Layer } from "svelte-canvas";
	import { position, controllerAvailable, controllerInUse, trigger } from './controller'
	import type { Position, RenderInterface } from './typings'
	import { client } from '../socket/socket'

	const mouseRadius = 10
	let canvas: Canvas

	let canvasWidth

	$: render = ({ context, width, height }: RenderInterface) => {

		const canvasOrigin: Position = {
			x: width / 2,
			y: height / 2
		}

		const translatedPosition: Position = $controllerInUse ? {
      x: ($position.x) * (width / 100),
			y: ($position.y) * (height / 100)
    } : {
			x: ($position.x) * (width / 50),
			y: ($position.y) * (height / 50)
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

    console.log($position)

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

	function mouseEvent({ clientX, clientY } : MouseEvent) {

		if ($controllerInUse) {
			return
		}

		const rect = canvas.getCanvas().getBoundingClientRect();
		const width = canvas.getCanvas().clientWidth;
		const height = canvas.getCanvas().clientHeight;
		console.log(width, height, clientX, clientY)

		$position = {
			x: (clientX) / (height / 100),
			y: (clientY) / (width / 100)
		};

		client.emit("position", $position)
	}

	function mouseLeave() {

		if ($controllerInUse) {
			return
		}

		$position = {
			x: 50,
			y: 50
		};

		$trigger = false;

		client.emit("position", $position)
		client.emit("trigger", false)
	}

	function switchControls() {
		$position = { x: 50, y: 50 }
		$controllerInUse = !$controllerInUse
	}

	const mouseDown = () => {

		if ($controllerInUse) return

		$trigger = true
		client.emit("trigger", true)
	}

	const mouseUp = () => {
		if ($controllerInUse) return
		$trigger = false
		client.emit("trigger", false)
	}

</script>

<div class="bg-gray-300 h-screen w-1/3 m-0" bind:clientWidth={canvasWidth}>
	<Canvas id="canvas"
		bind:this={canvas} on:mouseleave={mouseLeave} on:mousemove={mouseEvent}
		on:mousedown={mouseDown}
		on:mouseup={mouseUp}
		width={canvasWidth} height={canvasWidth}
	>
		<Layer {render}></Layer>
	</Canvas>
	{#if $controllerAvailable}
		<button class="w-full" on:click={switchControls}>Use { $controllerInUse ? "Mouse" : "Controller" }</button>
	{/if}
</div>

<style>
	button {
		font-size: 1.3rem;
	}

	:global(#canvas) {
		cursor: none;
		border: 5px solid darkgray;
	}
</style>