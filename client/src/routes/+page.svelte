<script lang="ts">
	import Camera from '$lib/camera/Camera.svelte';
	import { cameras, type Camera as CameraType } from '$lib/camera/camera';
	import ControllerCanvas from '$lib/controller/ControllerCanvas.svelte';
	import { forward } from '$lib/controller/controller';
	import Screenshots from '$lib/screenshots/Screenshots.svelte';
	import Icon from 'svelte-awesome';
	import gear from 'svelte-awesome/icons/gear';
	import Settings from '$lib/settings/Settings.svelte';
	import { getContext } from 'svelte';
	const { open } = getContext('simple-modal');
	import { fancyTime, times } from '$lib/timer/timer';

	let selectedCamera: CameraType | null = null;
</script>

<svelte:window
	on:keypress={(event) => {
		if (event.key == 'V' && !document.activeElement) {
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
		} else if (event.key == 'v' && !document.activeElement) {
			if (!selectedCamera) {
				selectedCamera = $cameras[0];
				return;
			}

			selectedCamera = $cameras[($cameras.indexOf(selectedCamera) + 1) % $cameras.length];
		}
	}}
/>

{#if $forward}
	<button
		on:click={() => ($forward = !$forward)}
		class="fixed bottom-0 right-1/2 bg-red-200 translate-x-[-50%] p-4 m-4"
		>Stop Going Forward</button
	>
{:else}
	<button
		on:click={() => ($forward = !$forward)}
		class="fixed bottom-0 right-1/2 bg-green-200 translate-x-[-50%] p-4 m-4">Go Forward</button
	>
{/if}

<main class="flex flex-row w-screen h-screen">
	<div class="w-1/5 flex flex-col divide-y border-r border-black divide-black">
		{#if $cameras.length === 0}
			<div
				class="w-full flex-grow p-8 text-center hover:cursor-pointer flex justify-center items-center bg-red-200 hover:bg-red-300 active:bg-red-400 transition-all text-xl"
				on:click={() => open(Settings)}
			>
				No cameras. Add some in the settings.
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
<div
	class="fixed right-0 top-1/2 translate-y-[-50%] p-4 border-b border-t border-l bg-gray-100 shadow-md rounded-l-lg border-black text-lg lg:text-xl xl:text-2xl"
>
	{#each $times as { time, active }}
		<p>
			{fancyTime(time)}
			{#if active}
				<button
					class="bg-red-100 hover:bg-red-200 active:bg-red-300 px-4 py-2 rounded-lg active:ring-2 ring-red-200 my-4"
					on:click={() => (active = false)}>Stop</button
				>
			{:else}
				<button
					class="bg-green-100 hover:bg-green-200 active:bg-green-300 px-4 py-2 rounded-lg active:ring-2 ring-green-200 my-4"
					on:click={() => (active = true)}>Start</button
				>
			{/if}
		</p>
	{/each}
</div>
<button class="fixed top-0 right-0 m-4" on:click={() => open(Settings)}>
	<Icon data={gear} scale={5} class="hover:rotate-12 transition-all" />
</button>
<div class="fixed bottom-0 right-0">
	<ControllerCanvas />
</div>
