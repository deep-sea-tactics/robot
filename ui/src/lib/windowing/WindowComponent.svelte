<script lang="ts">
	import Icon from 'svelte-awesome';
	import close from 'svelte-awesome/icons/close';
	import { draggable } from '@neodrag/svelte';
	import { windows } from './Taskbar.svelte';

	export let windowName: string;
	export let x = 0;
	export let y = 0;
	export let width = 200;
	export let height = 200;
	export let color: string;
	$windows[windowName] = { enabled: true, color };

	let beingDragged = false;

	const disable = () =>{
		$windows[windowName] = { ...$windows[windowName], enabled: false }
		$windows = $windows
	}
</script>

<svelte:window
	on:mousemove={({ movementX, movementY }) => {
		if (beingDragged) {
			height += movementY;
			width += movementX;
		}
	}}
	on:selectstart={event => {
		// prevent silly text selection
		if (beingDragged) {
			event.preventDefault()
		}
	}}
	on:mouseup={() => {
		beingDragged = false;
	}}
/>

{#if $windows[windowName].enabled}
	<div
		class="dockable-window"
		use:draggable={{
			bounds: '.container',
			defaultPosition: { x, y },
			position: { x, y },
			disabled: beingDragged,
			onDrag: ({ offsetX, offsetY }) => {
				x = offsetX
				y = offsetY
			}
		}}
		style="--color: {color}; width: {width}px"
	>
		<div class="dockable-tools">
			{windowName}
			<div
				class="dockable-icon"
				on:click={disable}
				on:keydown={event => {
					if (event.key == 'Enter') disable();
				}}
			>
				<Icon data={close} />
			</div>
		</div>
		<div
			class="dockable-resize {beingDragged ? 'dragging' : ''}"
			on:mousedown={() => {
				beingDragged = true;
			}}
		/>
		<div class="dockable-content" style="height: {height}px; width: {width}px">
			<slot />
		</div>
	</div>
{/if}

<style lang="scss">

	$debug: false;
	
	.dockable-window {
		position: fixed;
		display: inline-block;
		border-width: 2px;
		flex-wrap: nowrap;
		border-style: solid;
		border: 2px solid;
		border-radius: 1rem;
		background-color: #EEE6D3;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2);
		cursor: move;
	}

	.dockable-resize {
		position: absolute;
		bottom: 0;
		right: 0;
		cursor: se-resize;
		width: 1.5rem;
		height: 1.5rem;
		transform: translate(0.50rem, 0.50rem);
		z-index: 10;
		@if $debug {
			background-color: rgba(200, 0, 0, 0.2);
		}
	}

	@if $debug {
		.dragging {
			background-color: rgba(0, 200, 0, 0.2);
		}
	}

	.dockable-icon {
		/** circular X button -- its a character, so be careful with 50% border radius */
		cursor: pointer;
		padding: 0rem;
		width: 25px;
    	height: 25px;
		line-height: 25px;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		border-radius: 50%;
		background-color: #D0F0F0;
	}

	.dockable-icon:hover {
		background-color: #D0F0F0;
	}

	.dockable-tools {
		display: flex;
		padding: 0.5rem;
		border-radius: 1rem 1rem 0 0;
		justify-content: space-between;
		background-color: var(--color);
	}
</style>
