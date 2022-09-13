<script lang="ts">
	import type { ControllerData } from '$lib/controllerData';
	export let data: ControllerData;
</script>

<div class="flex flex-row w-1/2">
	<button
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-300={data.buttons.side_panel.top_left}>Top Left</button
	>
	<button
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-300={data.buttons.side_panel.top_middle}>Top Middle</button
	>
	<button
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-300={data.buttons.side_panel.top_right}>Top Right</button
	>
</div>
<br />
<div class="flex flex-row w-1/2">
	<button
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-300={data.buttons.side_panel.bottom_left}>Bottom Left</button
	>
	<button
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-300={data.buttons.side_panel.bottom_middle}>Bottom Middle</button
	>
	<button
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-300={data.buttons.side_panel.bottom_right}>Bottom Right</button
	>
</div>
