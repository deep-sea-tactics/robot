<script lang="ts">
	import Camera from '$lib/camera/Camera.svelte';
	import { cameras, type Camera as CameraType } from '$lib/camera/camera';
	import ControllerCanvas from '$lib/controller/ControllerCanvas.svelte';
	import Screenshots from '$lib/screenshots/Screenshots.svelte';
	import Icon from 'svelte-awesome';
	import gear from 'svelte-awesome/icons/gear';
	import { client } from '$lib/socket/socket'
	import { getContext } from 'svelte';
	import { fancyTime } from '$lib/timer/timer';
	const { open } = getContext('simple-modal');

	let selectedCamera: CameraType | null = null;
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
	async function openController() {
		if (!(navigator as any).hid) return;
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

	$: client.emit(`clientControllerData`, processedData)

</script>

<svelte:window
	on:keydown|preventDefault={(event) => {
		console.log(event.keyCode)
		if (event.keyCode == 37) { // moves the camera backwards on a capital v input
			if (!selectedCamera) {
				selectedCamera = $cameras[$cameras.length - 1];
				return;
			}

			selectedCamera =
				$cameras[
					$cameras.indexOf(selectedCamera) == 0
						? $cameras.length - 1
						: $cameras.indexOf(selectedCamera) - 1
				];
		} else if (event.keyCode == 39) { // moves the camera forwards on a lowwercase v
			if (!selectedCamera) {
				selectedCamera = $cameras[0];
				return;
			}

			selectedCamera = $cameras[($cameras.indexOf(selectedCamera) + 1) % $cameras.length];
		} else if (event.key.toLowerCase() == 'h') {
			openController()
		}
	}}
/>

<main class="flex flex-row w-screen h-screen"> 
	<div class="w-1/5 flex flex-col divide-y border-r border-black divide-black">
		{#if $cameras.length === 0}
			<div
				class="w-full flex-grow p-8 text-center hover:cursor-pointer flex justify-center items-center bg-red-200 hover:bg-red-300 active:bg-red-400 transition-all text-xl"
			>
				No cameras detected.
			</div>
		{:else}
			{#each $cameras as camera}
				<div
					class="w-full hover:cursor-pointer flex-grow p-8 text-center flex justify-center items-center bg-lime-200 hover:bg-lime-300 active:bg-lime-400 transition-all text-xl"
					class:bg-lime-400={selectedCamera == camera}
					class:font-bold={selectedCamera == camera}
					on:click={() => (selectedCamera = camera)}
				>
					<span>
						{camera.description} ({camera.port})
					</span>
				</div>
			{/each}
		{/if}
		<div class="w-full flex-shrink p-2 flex justify-center items-center bg-gray-300">
			Press <kbd>V</kbd> to cycle
		</div>
	</div>
	<div class="w-full">
		{#if selectedCamera}
			{#key selectedCamera}
				<Camera port={selectedCamera.port} />
			{/key}
		{:else}
			<p class="flex items-center justify-center w-full h-full text-2xl font-semibold">
				<span>
					No camera selected.<br />
					Press <kbd>V</kbd> to cycle or click to select one.
				</span>
			</p>
		{/if}
	</div>
	<Screenshots />
</main>
<div class="fixed bottom-0 right-0">
	<ControllerCanvas />
</div>
