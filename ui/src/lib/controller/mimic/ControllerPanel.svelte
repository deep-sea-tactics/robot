<script lang="ts">
	import type { ControllerData } from 'landstown-robotics-types';
	export let data: ControllerData;
</script>

<div class="flex flex-row w-1/2 text-center">
	<span
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-500={data.buttons.controller_buttons.top_left}>Top Left</span
	>
	<span
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-500={data.buttons.controller_buttons.top_right}>Top Right</span
	>
</div>
<div class="flex flex-row w-1/2 text-center">
	<span
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-500={data.buttons.controller_buttons.bottom_left}>Bottom Left</span
	>
	<span
		class="flex-grow m-4 bg-gray-200 px-4 py-2 rounded-md"
		class:bg-gray-500={data.buttons.controller_buttons.bottom_right}>Bottom Right</span
	>
</div>
