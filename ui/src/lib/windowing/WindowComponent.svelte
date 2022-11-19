<script lang="ts">
	import Icon from 'svelte-awesome';
	import close from 'svelte-awesome/icons/close';
	import { draggable } from '@neodrag/svelte';
	import { windows } from './Taskbar.svelte';

	export let windowName: string;
	let x = 100;
	let y = 100;
	let mouseStart = { x: 0, y: 0 };
	export let width = 0;
	export let height = 0;
	$windows[windowName] = true;

	let beingDragged = false;

	const disable = () => ($windows[windowName] = false);
</script>

<svelte:window
	on:mousemove={mouse => {
		if (beingDragged) {
			let heightChange = mouse.y - mouseStart.y;
			let widthChange = mouse.x - mouseStart.x;
			height += heightChange;
			width += widthChange;
			mouseStart = { x: mouse.x, y: mouse.y };
		}
	}}
	on:selectstart={event => {
		if (beingDragged) {
			event.preventDefault()
		}
	}}
	on:mouseup={() => {
		if (beingDragged) {
			beingDragged = false;
		}
	}}
/>

{#if $windows[windowName]}
	<div
		class="dockable-window"
		use:draggable={{
			bounds: '.primary-container',
			defaultPosition: { x, y },
			position: { x, y },
			disabled: beingDragged,
			onDrag: ({ offsetX, offsetY }) => {
				x = offsetX
				y = offsetY
			}
		}}
		style="width: {width}px"
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
			on:mousedown={mouse => {
				mouseStart = { x: mouse.x, y: mouse.y };
				beingDragged = true;
			}}
		/>
		<div class="dockable-content" style="height: {height}px; width: {width}px">
			<slot />
		</div>
	</div>
{/if}

<style>
	
	.dockable-window {
		position: fixed;
		display: inline-block;
		border-width: 2px;
		flex-wrap: nowrap;
		border-style: solid;
		border: 2px solid;
		border-radius: 1rem;
		background-color: #d3d3d3;
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
		transform: translate(0.75rem, 0.75rem);
		background-color: rgba(200, 0, 0, 0.2);
	}

	.dragging {
		background-color: rgba(0, 200, 0, 0.2);
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
		background-color: #d3d3d3;
	}

	.dockable-icon:hover {
		background-color: #c3c3c3;
	}

	.dockable-tools {
		display: flex;
		padding: 0.5rem;
		border-radius: 1rem 1rem 0 0;
		justify-content: space-between;
		background-color: #adadad;
	}
</style>
