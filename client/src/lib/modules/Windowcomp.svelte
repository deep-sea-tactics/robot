<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	export let windowdata = writable<{ [key: string]: boolean }>({
		keybinds: true,
		visualizer: true,
		camera: true
	});
</script>

<script lang="ts">
	import Icon from 'svelte-awesome';
	import minus from 'svelte-awesome/icons/minus';
	import { draggable } from '@neodrag/svelte';
	export let windowname: string;

	let manageData = () => {
		$windowdata[windowname] = false;
	};
</script>

{#if $windowdata[windowname]}
	<div
		class="dockable-window"
		use:draggable={{ bounds: '.primary-container', defaultPosition: { x: 0, y: 0 } }}
	>
		<div class="dockable-tools">
			<div class="dockable-icon" on:click={() => manageData()}>
				<Icon data={minus} />
			</div>
		</div>
		<slot />
	</div>
{/if}

<style>
	.dockable-window {
		display: inline-block;
		border-width: 2px;
		flex-wrap: nowrap;
		border-style: solid;
		border-image: linear-gradient(90deg, #42a5f5 0%, #0d47a1 100%) 1;
		background-color: #b6b6b6;
		cursor: move;
	}
	.dockable-window .dockable-tools {
		display: flex;
		justify-content: right;
		border-style: solid;
		border-bottom-width: 2px;
		border-image: linear-gradient(90deg, #42a5f5 0%, #0d47a1 100%) 1;
		background-color: #b6b6b680;
	}
	.dockable-icons {
		cursor: pointer;
	}
</style>
