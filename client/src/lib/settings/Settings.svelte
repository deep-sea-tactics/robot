<script lang="ts">
	import { cameras, defaultCameras } from '../camera/camera';
	import { autofocus } from '../autofocus';
	import Icon from 'svelte-awesome';
	import trash from 'svelte-awesome/icons/trash';

	let newDescription = '';
	let newPort = 8000;
</script>

<h1 class="text-2xl">Settings</h1>

<h2 class="text-xl">Cameras (Double click to edit)</h2>
<div class="border-l border-black pl-2">
	{#each $cameras as { description, descriptionEditable, port, portEditable }, i}
		<div>
			{#if descriptionEditable}
				<input
					use:autofocus
					on:blur={() => (descriptionEditable = false)}
					bind:value={description}
				/>
			{:else}
				<span on:dblclick={() => (descriptionEditable = !descriptionEditable)}
					>{description ? description : 'Enter Description'}</span
				>
			{/if}
			-
			{#if portEditable}
				<input
					type="number"
					use:autofocus
					on:blur={() => (portEditable = false)}
					bind:value={port}
				/>
			{:else}
				<span on:dblclick={() => (portEditable = true)}>{port}</span>
			{/if}
			<button on:click={() => ($cameras = $cameras.filter((_, index) => i !== index))}
				><Icon data={trash} class="hover:fill-red-700 transition-all" /></button
			>
		</div>
	{/each}
</div>
Description:<input placeholder="Enter Description" bind:value={newDescription} /><br />
Port: <input bind:value={newPort} type="number" /><br />
<button
	class="px-4 py-2 bg-blue-200 rounded-md my-2"
	on:click={() => {
		$cameras = [
			...$cameras,
			{
				description: newDescription,
				port: newPort
			}
		];

		newDescription = '';
		newPort = 8000;
	}}>Add</button
><br />
<button
	class="px-4 py-2 bg-blue-200 rounded-md my-2"
	on:click={() => ($cameras = [...defaultCameras])}>Reset to Default</button
>