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
		display: block;
		height: min-content;
		padding: 2rem;
		margin: 2rem;
		border-radius: 2rem;
		border-style: solid;
		width: calc(100vw - 4rem);
		font-size: 2rem;
		border-image: linear-gradient(90deg, #42a5f5 0%, #0d47a1 100%) 1;
		background-color: #b6b6b6;
	}
</style>
