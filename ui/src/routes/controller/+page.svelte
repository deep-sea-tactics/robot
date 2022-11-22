<script lang="ts">
	import { processData } from '$lib/controller/parse';
	import SidePanel from '$lib/controller/mimic/SidePanel.svelte';
	import ControllerPanel from '$lib/controller/mimic/ControllerPanel.svelte';
	import Boolean from '$lib/controller/mimic/Boolean.svelte';
	import GeneralVisualizer from '$lib/controller/mimic/GeneralVisualizer.svelte';

	let opened = false;
	let dataBuffer: DataView;
	$: processedData = dataBuffer ? processData(dataBuffer) : null;
	async function open() {
		if (!navigator.hid) return;
		const hid = navigator.hid;
		const [device] = await hid.requestDevice({
			filters: [
				{
					vendorId: 1133,
					productId: 49685
				}
			]
		});
		await device.open();
		opened = true;

		device.addEventListener('inputreport', ({ data }) => {
			dataBuffer = data;
		});
	}
</script>

{#if processedData}
	<div class="m-auto">
		<GeneralVisualizer data={processedData} />
		<p>X: {processedData.position.x} | Y: {processedData.position.y}</p>
		<p>Yaw: {processedData.yaw}</p>
		<p>View: {processedData.view}</p>
		<p>Throttle: {processedData.throttle}</p>
		<p>Trigger: <Boolean value={processedData.buttons.trigger} /></p>
		<p>Side Grip: <Boolean value={processedData.buttons.side_grip} /></p>
		<br />
		<ControllerPanel data={processedData} />
		<br />
		<SidePanel data={processedData} />
	</div>
{:else if opened}
	<p>Waiting for input...</p>
{:else}
	<button
		class="
    fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]
    px-16 py-8 rounded-lg bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-all
    text-5xl
    "
		on:click={open}>Begin Visualizer</button
	>
{/if}
