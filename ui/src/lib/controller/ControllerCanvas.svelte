<script lang="ts">
	import { Canvas, Layer } from 'svelte-canvas';
	import { data } from './controller';

	interface RenderInterface {
		context: CanvasRenderingContext2D;
		width: number;
		height: number;
	}

	const mouseRadius = 10;

	let width = 0;
	let height = 0;
	$: minDimension = Math.min(width, height);

	$: render = ({ context, width, height }: RenderInterface) => {
		if (!$data) return;

		const canvasOrigin = {
			x: width / 2,
			y: height / 2
		};

		const translatedPosition = {
			x: $data.position.x * (width / 100),
			y: $data.position.y * (height / 100)
		};

		context.fillStyle = `rgba(0, 200, 0, 0.2)`;

		// Add throttle
		context.fillRect(
			0,
			height - ($data.throttle / 255) * height,
			width,
			($data.throttle / 255) * height
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
	class="w-full h-full"
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<Canvas
		style="margin: 0 auto; padding: 2rem;"
		width={minDimension}
		height={minDimension}
	>
		<Layer {render} />
	</Canvas>
</div>
