<script lang="ts">
	import { Canvas, Layer } from 'svelte-canvas';
	import type { ControllerData } from 'landstown-robotics-types';
	export let data: ControllerData;
	const mouseRadius = 10;
	$: render = ({
		context,
		width,
		height
	}: {
		context: CanvasRenderingContext2D;
		width: number;
		height: number;
	}) => {
		const canvasOrigin = {
			x: width / 2,
			y: height / 2
		};
		const translatedPosition = {
			x: data.position.x * (width / 100),
			y: data.position.y * (height / 100)
		};
		context.fillStyle = `rgba(0, 200, 0, 0.2)`;
		// Add throttle
		context.fillRect(
			0,
			height - (data.throttle / 255) * height,
			width,
			(data.throttle / 255) * height
		);
		// Base stroke style
		context.strokeStyle = `rgb(50, 168, 96)`;
		context.fillStyle = `rgb(50, 168, 96)`;
		// Create a line between the center of the circle and the mouse's position
		context.beginPath();
		context.moveTo(canvasOrigin.x, canvasOrigin.y);
		context.lineTo(translatedPosition.x, translatedPosition.y);
		context.stroke();
		// Create an origin circle
		context.beginPath();
		context.arc(canvasOrigin.x, canvasOrigin.y, mouseRadius / 2, 0, 2 * Math.PI);
		context.fill();
		context.strokeStyle = 'black';
		context.fillStyle = 'black';
		// Create a circle around the mouse
		context.beginPath();
		context.arc(translatedPosition.x, translatedPosition.y, mouseRadius, 0, 2 * Math.PI);
		context.stroke();
		if (data.buttons.trigger) {
			context.beginPath();
			context.arc(translatedPosition.x, translatedPosition.y, mouseRadius, 0, Math.PI);
			context.fill();
		}
		if (data.buttons.side_grip) {
			context.beginPath();
			context.arc(translatedPosition.x, translatedPosition.y, mouseRadius, 0, Math.PI, true);
			context.fill();
		}
		// Add yaw point
		context.strokeStyle = 'blue';
		const angle = -((data.yaw / 255) * ((2 * Math.PI) / 3) - Math.PI / 3);
		context.beginPath();
		context.arc(
			translatedPosition.x - Math.sin(angle) * 6,
			translatedPosition.y - Math.cos(angle) * 6,
			mouseRadius / 4,
			0,
			2 * Math.PI
		);
		context.stroke();
	};
</script>

<Canvas
	style="background-color: #d4d4d4;"
	width={100}
	height={100}
>
	<Layer {render} />
</Canvas>
