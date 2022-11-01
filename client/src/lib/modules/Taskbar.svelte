<script lang="ts" context="module">
	import { derived, writable } from 'svelte/store';
	export const windows = writable<{ [key: string]: boolean }>({});
</script>

<script lang="ts">
	import Icon from 'svelte-awesome';
	import keyboardO from 'svelte-awesome/icons/keyboardO';
</script>

<div class="taskbar">
	{#if Object.values($windows).some((bool) => !bool)}
		{#each Object.entries($windows) as [name, on]}
			{#if !on}
				<span
					on:click={() => ($windows[name] = true)}
					on:keydown={(event) => {
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
		padding: 2rem;
		position: fixed;
		bottom: 0;
		left: 0;
		border-style: solid;
		width: 100%;
		font-size: 2rem;
		border-image: linear-gradient(90deg, #42a5f5 0%, #0d47a1 100%) 1;
		background-color: #b6b6b6;
	}
</style>
