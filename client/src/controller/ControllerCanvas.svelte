<script lang="ts">

	import { onMount } from "svelte"
	import { Canvas, Layer } from "svelte-canvas";
	import { position, controllerAvailable } from './controller'
	import { client } from '../socket/socket'
	import type { Position, RenderInterface } from './typings'

	const mouseRadius = 10
	let canvas: Canvas
	let container: HTMLDivElement

	let canvasWidth = 300

	$: render = ({ context, width, height }: RenderInterface) => {

		const canvasOrigin: Position = {
			x: width / 2,
			y: height / 2
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
		context.lineTo($position.x, $position.y);
		context.stroke();

		// Create an origin circle
		context.beginPath();
		context.arc(canvasOrigin.x, canvasOrigin.y, mouseRadius / 2, 0, 2 * Math.PI);
		context.fill();

		context.strokeStyle = "black"
		context.fillStyle = "black"

		// Create a circle around the mouse
		context.beginPath();
		context.arc($position.x, $position.y, mouseRadius, 0, 2 * Math.PI);
		context.stroke();

		// Fill the area around the circle with white

		context.strokeStyle = "gray"
		context.fillStyle = "gray"

		context.beginPath();
		context.arc(canvasOrigin.x, canvasOrigin.y, circleRadius, 0, 2 * Math.PI);
		context.rect(width, 0, -width, width);
		context.fill();
	}

	onMount(() => {
		canvasWidth = container.clientWidth
	})

	function mouseEvent({ clientX, clientY } : MouseEvent) {
		const rect = canvas.getCanvas().getBoundingClientRect();

		$position = {
			x: clientX - rect.left,
			y: clientY - rect.top
		};

		client.emit("position", $position)
	}

	function mouseLeave() {
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