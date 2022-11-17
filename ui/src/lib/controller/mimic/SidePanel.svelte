<script lang="ts">
	import type { ControllerData } from 'typings';
	export let data: ControllerData;
</script>

<div class="flex flex-row w-1/2 text-center">
	<span
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-500={data.buttons.side_panel.top_left}>Top Left</span
	>
	<span
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-500={data.buttons.side_panel.top_middle}>Top Middle</span
	>
	<span
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-500={data.buttons.side_panel.top_right}>Top Right</span
	>
</div>
<br />
<div class="flex flex-row w-1/2 text-center">
	<span
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-500={data.buttons.side_panel.bottom_left}>Bottom Left</span
	>
	<span
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-500={data.buttons.side_panel.bottom_middle}>Bottom Middle</span
	>
	<span
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-500={data.buttons.side_panel.bottom_right}>Bottom Right</span
	>
</div>
