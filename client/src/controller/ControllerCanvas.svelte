<script lang="ts">

	import { Canvas, Layer } from "svelte-canvas";
	import { position, controllerAvailable, controllerInUse } from './controller'
	import type { Position, RenderInterface } from './typings'
	import { client } from '../socket/socket'

	const mouseRadius = 10
	let canvas: Canvas
	let container: HTMLDivElement

	let canvasWidth

	$: render = ({ context, width, height }: RenderInterface) => {

		const canvasOrigin: Position = {
			x: width / 2,
			y: height / 2
		}

		const translatedPosition: Position = {
			x: ($position.x) * (width / 100),
			y: ($position.y) * (height / 100)
		}

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
		context.stroke();

	}

	function mouseEvent({ clientX, clientY } : MouseEvent) {

		if ($controllerInUse) {
			return
		}

		const rect = canvas.getCanvas().getBoundingClientRect();
		const width = canvas.getCanvas().width;
		const height = canvas.getCanvas().height;

		$position = {
			x: (clientX - rect.left) / (width / 100),
			y: (clientY - rect.top) / (height / 100)
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

		client.emit("position", $position)
	}

	function switchControls() {
		$controllerInUse = !$controllerInUse
	}

</script>

<div id="controller" bind:clientWidth={canvasWidth} bind:this={container}>
	<Canvas id="canvas"
		bind:this={canvas} on:mouseleave={mouseLeave} on:mousemove={mouseEvent} 
		width={canvasWidth} height={canvasWidth}
	>
		<Layer {render}></Layer>
	</Canvas>
	{#if $controllerAvailable}
		<button on:click={switchControls}>Use { controllerInUse ? "Mouse" : "Controller" }</button>
	{/if}
</div>

<style lang="scss">
	#controller {
		background-color: lightgray;
		grid-area: controller;
	}

	:global(#canvas) {
		cursor: none;
		border: 5px solid darkgray;
	}
</style>