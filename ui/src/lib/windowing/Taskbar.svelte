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
</script>

<div class="taskbar">
	{#if Object.values($windows).some(data => !data.enabled)}
		{#each Object.entries($windows) as [name, data]}
			{#if !data.enabled}
				<span
					style="--color: {data.color}"
					on:click={() => ($windows[name] = { ...data, enabled: true })}
					on:keydown={event => {
						if (event.key == 'Enter') $windows[name] = { ...data, enabled: true };
					}}>{name}</span
				>
			{/if}
		{/each}
	{:else}
		<span class="none">No windows yet</span>
	{/if}
</div>

<div class="container">
	<slot />
</div>

<style>
	.none {
		color: rgb(60, 60, 60);
		font-style: italic;
	}

	.taskbar {
		border: 2px solid black;
		display: block;
		flex-shrink: 1;
		padding: 1rem;
		margin: 2rem;
		margin-bottom: 0;
		border-radius: 1rem;
		width: calc(100vw - 4rem);
		font-size: 1.5rem;
		background-color: #c2d0f3;
	}

	span {
		background-color: var(--color);
		padding: 0.5rem;
		border-radius: 1rem;
		margin-right: 1rem;
	}

	.container {
		width: calc(100vw - 4rem);
		height: 100%;
		margin: 2rem;
		flex-grow: 1;
	}
</style>
