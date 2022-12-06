<script
	lang="ts"
	context="module"
>
	import { writable } from 'svelte/store';

	interface WindowInfo {
		enabled: boolean;
		color: string;
	}

	export const zIndex = writable(0);
	export const windows = writable<{ [key: string]: WindowInfo }>({});
	let taskBarIconTransparency = 30;
</script>

<div class="taskbar">
	{#if Object.values($windows).some(data => !data.enabled)}
		{#each Object.entries($windows) as [name, data]}
			{#if !data.enabled}
				<span
					style="--bgcolor: {data.color}{taskBarIconTransparency.toString(
						16
					)}; --color: {data.color}; cursor: pointer;"
					on:click={() => ($windows[name] = { ...data, enabled: true })}
					on:keydown={event => {
						if (event.key == 'Enter') $windows[name] = { ...data, enabled: true };
					}}>{name}</span
				>
			{/if}
		{/each}
	{:else}
		<span class="none">No closed windows yet</span>
	{/if}
</div>

<div class="container">
	<slot />
</div>

<style>
	.none {
		color: rgb(255, 255, 255);
	}

	.taskbar {
		display: block;
		flex-shrink: 1;
		bottom: 0;
		padding: 1rem;
		margin-bottom: 0;
		width: 100vw;
		font-size: 1.5rem;
		background-color: rgba(31, 31, 31, 100);
		position: absolute;
		z-index: 1000000000;
	}

	span {
		background-color: var(--bgcolor);
		color: var(--color);
		padding: 0.5rem;
		border-radius: 5px;
		margin-right: 1rem;
	}

	.container {
		width: 100vw;
		height: 100%;
		flex-grow: 1;
	}
</style>
