<script
	lang="ts"
	context="module"
>
	import { writable } from 'svelte/store';
	export const windows = writable<{ [key: string]: boolean }>({});
</script>

<div class="taskbar">
	{#if Object.values($windows).some(bool => !bool)}
		{#each Object.entries($windows) as [name, on]}
			{#if !on}
				<span
					on:click={() => ($windows[name] = true)}
					on:keydown={event => {
						if (event.key == 'Enter') $windows[name] = true;
					}}>{name}</span
				>
			{/if}
		{/each}
	{:else}
		<span class="none">No windows yet</span>
	{/if}
</div>

<style>
	.none {
		color: rgb(60, 60, 60);
		font-style: italic;
	}

	.taskbar {
		border: 2px solid;
		display: block;
		height: min-content;
		padding: 2rem;
		margin: 2rem;
		margin-bottom: 0;
		border-radius: 1rem;
		width: calc(100vw - 4rem);
		font-size: 2rem;
		background-color: #b6b6b6;
	}
</style>
