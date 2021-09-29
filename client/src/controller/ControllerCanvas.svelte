<script lang="ts">

	import { onMount } from "svelte"
	import { Canvas, Layer } from "svelte-canvas";
	import { position, controllerAvailable, controllerInUse } from './controller'
	import type { Position, RenderInterface } from './typings'
	import { client } from '../socket/socket'

	const mouseRadius = 10
	let canvas: Canvas
	let container: HTMLDivElement

	let canvasWidth = 300

	$: render = ({ context, width, height }: RenderInterface) => {

		const canvasOrigin: Position = {
			x: width / 2,
			y: height / 2
		}

		const translatedPosition: Position = {
			x: ($position.x) * (width / 100),
			y: ($position.y) * (height / 100)
		}

		// Store the circle radius, useful for restricting the cursor
		const circleRadius = width / 2 - 10;

		// Base stroke style
		context.strokeStyle = "black";

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

	onMount(() => {
		canvasWidth = container.clientWidth
	})

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
			x: canvas.getCanvas().width / 2,
			y: canvas.getCanvas().height / 2
		};

		client.emit("position", $position)
	}
</script>

<div id="controller" bind:this={container}>
	<Canvas 
		bind:this={canvas} on:mouseleave={mouseLeave} on:mousemove={mouseEvent} 
		width={canvasWidth} height={canvasWidth}
	>
		<Layer {render}></Layer>
	</Canvas>
	{#if $controllerAvailable}
		<button>Use Controller</button>
		<button>Use Mouse</button>
	{/if}
</div>

<style lang="scss">
	#controller {
		background-color: lightgray;
		grid-area: controller;
	}
</style>