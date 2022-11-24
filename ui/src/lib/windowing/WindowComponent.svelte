<script lang="ts">
	import Icon from 'svelte-awesome';
	import close from 'svelte-awesome/icons/close';
	import { draggable } from '@neodrag/svelte';
	import { windows, zIndex } from './Taskbar.svelte';

	export let windowName: string;
	export let x = 0;
	export let y = 0;
	export let width = 200;
	export let height = 200;
	export let color: string;
	let snapSensativity = 50;
	let thisTarget = false;
	let windowX = 0;
	let windowY = 0;
	let toolsHeight = 0;
	let savedWindowDetails = { x: 0, y: 0 };
	let currentMousePos = { x: 0, y: 0 };
	let originalMousePos = { x: 0, y: 0 };
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
	on:mousemove={({ clientX, clientY }) => {
		currentMousePos = { x: clientX, y: clientY };
		if (beingDragged) {
			height = Math.max(savedWindowDetails.y + (currentMousePos.y - originalMousePos.y), 200);
			width = Math.max(savedWindowDetails.x + (currentMousePos.x - originalMousePos.x), 200);
			/* height = Math.max(height + movementY, 200);
			width = Math.max(width + movementX, 200); */
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
			if (clientX <= snapSensativity) {
				x = 0;
				y = 0;
				height = windowY - toolsHeight;
				width = windowX / 2;
			}
			if (clientX >= windowX - snapSensativity) {
				x = windowX - windowX / 2;
				y = 0;
				height = windowY - toolsHeight;
				width = windowX / 2;
			}
			thisTarget = false;
		}
	}}
	on:mousedown={event => {
		savedWindowDetails = { x: width, y: height };
		console.log(event.target);
		originalMousePos = { ...currentMousePos };
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
			class="dockable-resize BR {beingDragged ? 'dragging' : ''}"
			on:mousedown|preventDefault={() => {
				$zIndex++;
				localZIndex = $zIndex;
				beingDragged = true;
			}}
		/>
		<div
			class="dockable-resize TR {beingDragged ? 'dragging' : ''}"
			on:mousedown|preventDefault={() => {
				$zIndex++;
				localZIndex = $zIndex;
				beingDragged = true;
			}}
		/>
		<div
			class="dockable-resize BL {beingDragged ? 'dragging' : ''}"
			on:mousedown|preventDefault={() => {
				$zIndex++;
				localZIndex = $zIndex;
				beingDragged = true;
			}}
		/>
		<div
			class="dockable-resize TL {beingDragged ? 'dragging' : ''}"
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
	$debug: true;

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
	.BR {
		bottom: 0;
		right: 0;
		z-index: 10;
		transform: translate(0.5rem, 0.5rem);
	}
	.TR {
		top: 0;
		right: 0;
		z-index: 10;
		transform: translate(0.5rem, -0.5rem);
	}
	.BL {
		bottom: 0;
		left: 0;
		z-index: 10;
		transform: translate(-0.5rem, 0.5rem);
	}
	.TL {
		top: 0;
		left: 0;
		z-index: 10;
		transform: translate(-0.5rem, -0.5rem);
	}
	.dockable-resize {
		position: absolute;
		cursor: se-resize;
		width: 1.5rem;
		height: 1.5rem;
		@if $debug {
			background-color: rgba(255, 0, 0, 0.5);
		}
	}

	@if $debug {
		.dragging {
			background-color: rgba(0, 255, 0, 0.5);
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
