<script lang="ts">
	import Icon from 'svelte-awesome';
	import minus from 'svelte-awesome/icons/minus';
	import { draggable } from '@neodrag/svelte';
	import { windows } from './Taskbar.svelte';

	export let windowName: string;
	let x = 0;
	let y = 0;
	$windows[windowName] = true;

	let beingDragged = false;

	const disable = () => ($windows[windowName] = false);
</script>

{#if $windows[windowName]}
	<div
		class="dockable-window"
		use:draggable={{
			bounds: '.primary-container',
			defaultPosition: { x: 0, y: 0 },
			position: { x, y },
			disabled: beingDragged
		}}
	>
		<div class="dockable-tools">
			<div
				class="dockable-icon"
				on:click={disable}
				on:keydown={(event) => {
					if (event.key == 'Enter') disable();
				}}
			>
				<Icon data={minus} />
			</div>
		</div>
		<div 
			class="dockable-resize {beingDragged ? "dragging" : ""}"
			on:mousedown|preventDefault={() => {
				beingDragged = true
			}}
			on:mouseup|preventDefault={() => {
				beingDragged = false
			}}
			></div>
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

	.dockable-resize {
		position: absolute;
		bottom: 0;
		right: 0;
		cursor: se-resize;
		width: 1.5rem;
		height: 1.5rem;
		transform: translate(0.75rem, 0.75rem);
		background-color: rgba(200, 0, 0, 0.2);
	}
	
	.dragging {
		background-color: rgba(0, 200, 0, 0.2);
	}

	.dockable-window .dockable-tools {
		display: flex;
		justify-content: right;
		border-style: solid;
		border-bottom-width: 2px;
		border-image: linear-gradient(90deg, #42a5f5 0%, #0d47a1 100%) 1;
		background-color: #b6b6b680;
	}
</style>
