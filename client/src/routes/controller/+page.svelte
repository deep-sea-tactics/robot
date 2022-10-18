<script lang="ts">
	import type { ControllerData } from 'typings';
	import SidePanel from '$lib/controller/mimic/SidePanel.svelte';
	import ControllerPanel from '$lib/controller/mimic/ControllerPanel.svelte';
	import Boolean from '$lib/controller/mimic/Boolean.svelte';
	import GeneralVisualizer from '$lib/controller/mimic/GeneralVisualizer.svelte';

	let opened = false;
	const bool = (num: number) => num !== 0;
	function buf2hex(buffer: ArrayBuffer) {
		return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('');
	}
	function processData(view: DataView): ControllerData {
		const rawData = buf2hex(view.buffer).match(/..?/g);
		if (rawData == null) throw Error('No data?');
		const parsedRawData = rawData.map((item) => parseInt(item, 16));
		return {
			position: {
				x: (((parsedRawData[1] & 0x03) << 8) + parsedRawData[0]) / 10.24,
				y: (((parsedRawData[2] & 0x0f) << 6) + ((parsedRawData[1] & 0xfc) >> 2)) / 10.24
			},
			yaw: parsedRawData[3],
			view: (parsedRawData[2] & 0xf0) >> 4,
			throttle: -parsedRawData[5] + 255,
			buttons: {
				trigger: bool((parsedRawData[4] & 0x01) >> 0),
				side_grip: bool((parsedRawData[4] & 0x02) >> 1),
				controller_buttons: {
					bottom_left: bool((parsedRawData[4] & 0x04) >> 2),
					bottom_right: bool((parsedRawData[4] & 0x08) >> 3),
					top_left: bool((parsedRawData[4] & 0x10) >> 4),
					top_right: bool((parsedRawData[4] & 0x20) >> 5)
				},
				side_panel: {
					bottom_left: bool((parsedRawData[4] & 0x40) >> 6),
					top_left: bool((parsedRawData[4] & 0x80) >> 7),
					bottom_middle: bool((parsedRawData[6] & 0x01) >> 0),
					top_middle: bool((parsedRawData[6] & 0x02) >> 1),
					bottom_right: bool((parsedRawData[6] & 0x04) >> 2),
					top_right: bool((parsedRawData[6] & 0x08) >> 3)
				}
			}
		};
	}
	let dataBuffer: DataView;
	$: processedData = dataBuffer ? processData(dataBuffer) : null;

	function hookToDevice(device: any) {
		device.addEventListener('inputreport', ({ data }: { data: any }) => {
			dataBuffer = data;
		});
	}

	async function open() {
		if (!(navigator as any).hid) return;
		const hid = (navigator as unknown as { hid: any }).hid;
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
		hookToDevice(device);
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
