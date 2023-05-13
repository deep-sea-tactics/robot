<script lang="ts">
	import Streamer from '$lib/camera/Streamer.svelte';
	import ControllerCanvas from '$lib/controller/ControllerCanvas.svelte';
	import Notepad from '$lib/windowing/Notepad.svelte';
	import { data } from '$lib/controller/controller';
	import { client } from '$lib/socket/socket';

	import WindowComponent from '$lib/windowing/WindowComponent.svelte';
	import Taskbar from '$lib/windowing/Taskbar.svelte';

	$: if ($data) client.emit(`controllerData`, $data);
</script>

<svelte:window
	on:keydown={event => {
		if (event.key == 'ArrowUp') {
			// do something
		}
	}}
/>

<main>
	<Taskbar>
		<WindowComponent
			windowName="Keybinds"
			height={200}
			width={200}
			color="#36EC85"
			x={0}
			y={0}
			open={false}
		>
			<div class="keybinds-wrap">
				<div class="keybinds-holder">
					<p><b>C</b> - Keybind?</p>
				</div>
			</div>
		</WindowComponent>
		<WindowComponent
			windowName="Video"
			height={400}
			width={400}
			color="#E1CE7A"
			x={300}
			open={true}
		>
			<Streamer />
		</WindowComponent>
		<WindowComponent
			windowName="Visualizer"
			color="#E58F65"
			height={200}
			width={200}
			y={300}
			open={true}
		>
			<ControllerCanvas />
		</WindowComponent>
		<WindowComponent
			windowName="Notepad"
			color="#B76EFA"
			height={200}
			width={200}
			y={300}
			open={false}
		>
			<Notepad />
		</WindowComponent>
	</Taskbar>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
	}
	.keybinds-holder {
		flex-wrap: nowrap;
		display: flex;
		flex-direction: column;
		text-align: left;
		margin: 5px;
	}
</style>
