<script lang="ts">
	import Icon from 'svelte-awesome';
	import close from 'svelte-awesome/icons/close';
	import { draggable } from '@neodrag/svelte';
	import { windows, zIndex } from './Taskbar.svelte';
	import { time_ranges_to_array } from 'svelte/internal';

	export let windowName: string;
	export let x = 0;
	export let y = 0;
	export let width = 200;
	export let height = 200;
	export let color: string;
	let thisTarget = false;
	let windowX = 0;
	let windowY = 0;
	let toolsHeight = 0;
	$windows[windowName] = { enabled: true, color };

	let beingDragged = false;
	let localZIndex = $zIndex;

	const disable = () => {
		$windows[windowName] = { ...$windows[windowName], enabled: false };
		$windows = $windows;
	};
</script>

<svelte:window
	bind:innerWidth={windowX}
	bind:innerHeight={windowY}
	on:mousemove={({ movementX, movementY, clientX, clientY }) => {
		if (beingDragged) {
			height = Math.max(height + movementY, 200);
			width = Math.max(width + movementX, 200);
		}
	}}
	on:selectstart={event => {
		// prevent silly text selection
		if (beingDragged) {
			event.preventDefault();
		}
	}}
	on:mouseup={({ clientX, clientY }) => {
		beingDragged = false;
		if (thisTarget) {
			//special positions that perform special resizing actions with the mouse.
			//check if the mouse is within 10 px of the edge
			console.log(x, windowX);
			if (clientX <= 50) {
				x = 0;
				y = 0;
				height = windowY - toolsHeight;
				width = windowX / 2;
			}
			thisTarget = false;
		}
	}}
	on:mousedown={event => {
		console.log(event.target);
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
				x = offsetX;
				y = offsetY;
			},
			onDragStart: () => {
				thisTarget = true;
				localZIndex = $zIndex += 1;
			}
		}}
		style="--color: {color}; width: {width}px; z-index: {localZIndex};"
	>
		<div
			class="dockable-tools"
			bind:clientHeight={toolsHeight}
		>
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
			on:mousedown|preventDefault={() => {
				$zIndex++;
				localZIndex = $zIndex;
				beingDragged = true;
			}}
		/>
		<div
			class="dockable-content"
			style="height: {height}px; width: {width}px"
		>
			<slot />
		</div>
	</div>
{/if}

<style lang="scss">
	$debug: false;

	.dockable-window {
		position: fixed;
		display: inline-block;
		flex-wrap: nowrap;
		border-radius: 1rem;
		background-color: #fff0f9;
		// We don't use border here because a border will leave a small gap
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 2px black;
		cursor: move;
	}

	.dockable-resize {
		position: absolute;
		bottom: 0;
		right: 0;
		cursor: se-resize;
		width: 1.5rem;
		height: 1.5rem;
		transform: translate(0.5rem, 0.5rem);
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
		flex-wrap: hide;
		justify-content: center;
		align-items: center;
		text-align: center;
		border-radius: 500000000000px; /*yum*/
		background-color: #f3e5ed;
	}

	.dockable-icon:hover {
		background-color: #f3e5ed;
	}

	.dockable-tools {
		display: flex;
		padding: 0.5rem;
		border-radius: 1rem 1rem 0 0;
		object-fit: contain;
		box-sizing: border-box;
		background-clip: border-box;
		justify-content: space-between;
		flex-wrap: hide;
		background-color: var(--color);
	}
</style>
