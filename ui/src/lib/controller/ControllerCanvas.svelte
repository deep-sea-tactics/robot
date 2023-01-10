<script lang="ts">
	import { Canvas, Layer, type Render } from 'svelte-canvas';
	import { data, controllerConnected } from './controller';

	const mouseRadius = 10;

	let width = 0;
	let height = 0;
	$: minDimension = Math.min(width, height);

	let render: Render;
	$: render = ({ context, width, height }) => {
		if (!$data) {
			context.textAlign = 'center';
			context.fillText('Input needed', width / 2, height / 2);

			return;
		}

		const canvasOrigin = {
			x: width / 2,
			y: height / 2
		};

		const translatedPosition = {
			x: $data.position.x * (width / 100),
			y: $data.position.y * (height / 100)
		};

		context.fillStyle = $controllerConnected ? `rgba(0, 200, 0, 0.2)` : `rgba(200, 0, 0, 0.2)`;

		// Add throttle
		context.fillRect(
			0,
			height - ($data.throttle / 255) * height,
			width,
			($data.throttle / 255) * height
		);

		// Base stroke style
		const style = $controllerConnected ? 'rgb(50, 168, 96)' : 'rgb(212 82 12)';
		context.strokeStyle = style;
		context.fillStyle = style;

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

		if ($data.buttons.trigger) {
			context.beginPath();
			context.arc(translatedPosition.x, translatedPosition.y, mouseRadius, 0, Math.PI);
			context.fill();
		}

		if ($data.buttons.side_grip) {
			context.beginPath();
			context.arc(translatedPosition.x, translatedPosition.y, mouseRadius, 0, Math.PI, true);
			context.fill();
		}
	};
</script>

<div
	class="camera-container"
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<Canvas
		width={minDimension}
		height={minDimension}
	>
		<Layer {render} />
	</Canvas>
</div>

<style>
	.camera-container {
		width: 100%;
		height: 100%;
	}
</style>
