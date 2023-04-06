<script lang="ts">
	import Icon from 'svelte-awesome';
	import close from 'svelte-awesome/icons/close';
	import caretDown from 'svelte-awesome/icons/caretDown';
	import { draggable } from '@neodrag/svelte';
	import { windows, zIndex } from './Taskbar.svelte';

	export let windowName: string;
	export let x = 0;
	export let y = 0;
	export let width = 200;
	export let height = 200;
	export let color: string;
	export let open = true;
	let minimized = false;
	let minWidth = 200;
	let snapSensitivity = 50;
	let windowX = 0;
	let windowY = 0;
	let toolsHeight = 0;
	let savedWindowDetails = { x: 0, y: 0 };
	let savedWindowPos = { x: 0, y: 0 };
	let currentMousePos = { x: 0, y: 0 };
	let originalMousePos = { x: 0, y: 0 };
	$windows[windowName] = { enabled: true, color };
	let heightOffset = false;
	let widthOffset = false;
	let disableHeightChange = false;
	let disableWidthChange = false;
	let beingDragged = false;
	let beingResized = false;
	let localZIndex = $zIndex;

	$: if (!open) {
		$windows[windowName].enabled = false;
	}

	function drag(
		/** If, when dragging, should the X position be translated (X modified) instead of just changing width */
		shouldTransformX: boolean,
		/** If, when dragging, should the Y position be translated (Y modified) instead of just changing height */
		shouldTransformY: boolean,
		shouldDisableHeightChange: boolean,
		shouldDisableWidthChange: boolean
	) {
		return (event: Event) => {
			event.preventDefault();
			$zIndex++;
			beingDragged = true;
			localZIndex = $zIndex;
			widthOffset = shouldTransformX;
			heightOffset = shouldTransformY;
			disableHeightChange = shouldDisableHeightChange;
			disableWidthChange = shouldDisableWidthChange;
		};
	}
</script>

<svelte:window
	bind:innerWidth={windowX}
	bind:innerHeight={windowY}
	on:mousemove={({ clientX, clientY }) => {
		currentMousePos = { x: clientX, y: clientY };
		if (beingDragged) {
			if (!disableWidthChange) {
				console.log(widthOffset);
				if (!widthOffset) {
					width = Math.max(
						savedWindowDetails.x + (currentMousePos.x - originalMousePos.x),
						minWidth
					);
				} else {
					width = Math.max(
						savedWindowDetails.x - (currentMousePos.x - originalMousePos.x),
						minWidth
					);
					if (savedWindowDetails.x - (currentMousePos.x - originalMousePos.x) > 200) {
						x = savedWindowPos.x + (currentMousePos.x - originalMousePos.x);
					}
				}
			}
			if (!disableHeightChange) {
				if (!heightOffset) {
					height = Math.max(
						savedWindowDetails.y + (currentMousePos.y - originalMousePos.y),
						minWidth
					);
				} else {
					height = Math.max(
						savedWindowDetails.y - (currentMousePos.y - originalMousePos.y),
						minWidth
					);
					if (savedWindowDetails.y - (currentMousePos.y - originalMousePos.y) > 200) {
						y = savedWindowPos.y + (currentMousePos.y - originalMousePos.y);
					}
				}
			}
		}
	}}
	on:mouseup={({ clientX }) => {
		beingDragged = false;
		if (beingResized) {
			if (clientX <= snapSensitivity) {
				x = 0;
				y = 0;
				height = windowY - toolsHeight;
				width = windowX / 2;
			}
			if (clientX >= windowX - snapSensitivity) {
				x = windowX - windowX / 2;
				y = 0;
				height = windowY - toolsHeight;
				width = windowX / 2;
			}
			beingResized = false;
		}
	}}
	on:mousedown={event => {
		savedWindowDetails = { x: width, y: height };
		savedWindowPos = { x, y };
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
			cancel: '.dockable-resize',
			applyUserSelectHack: true,
			onDrag: ({ offsetX, offsetY }) => {
				x = offsetX;
				y = offsetY;
			},
			onDragStart: () => {
				beingResized = true;
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
			<div class="dockable-icon">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					on:click={() => (minimized = !minimized)}
					style={minimized ? 'transform: rotate(180deg);' : ''}
				>
					<Icon data={caretDown} />
				</div>
				<div
					on:click={() => ($windows[windowName].enabled = false)}
					on:keydown={event => {
						if (event.key == 'Enter') $windows[windowName].enabled = false;
					}}
				>
					<Icon data={close} />
				</div>
			</div>
		</div>
		{#each ['BR', 'TR', 'BL', 'TL'] as location}
			<div
				class="dockable-resize {location} corner {beingDragged ? 'dragging' : ''}"
				style={minimized ? 'display: none' : 'display: block'}
				on:mousedown={drag(location[1] == 'L', location[0] == 'T', false, false)}
			/>
		{/each}
		{#each ['T', 'B', 'L', 'R'] as location}
			<div
				class="dockable-resize {location + 'C'} {['T', 'B'].includes(location)
					? 'horizontal'
					: 'vertical'}-grabber {beingDragged ? 'dragging' : ''}"
				style={minimized ? 'display: none' : 'display: block'}
				on:mousedown={drag(
					['T', 'L'].includes(location),
					['T', 'R'].includes(location),
					['L', 'R'].includes(location),
					['T', 'B'].includes(location)
				)}
			/>
		{/each}

		{#if !minimized}
			<div
				class="dockable-content fun"
				style="height: {minimized ? 0 : height}px; width: {width}px; {!beingDragged
					? 'transition: height 0.25s ease-in-out;'
					: 'transition: none'}"
			>
				<slot />
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	$debug: false;
	.dockable-window {
		position: fixed;
		display: inline-block;
		flex-wrap: nowrap;
		border-radius: 5px;
		background-color: #ffffff;
		// We don't use border here because a border will leave a small gap
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2);
		cursor: move;
	}

	//just a bunch of utility classes for window resizing. A little messy but um, I have no intention of fixing that.
	.corner {
		width: 1.2rem;
		height: 1.2rem;
		z-index: 10;
		@if $debug {
			background-color: rgba(255, 0, 0, 0.5);
		}
	}
	.horizontal-grabber {
		height: 1.2rem;
		width: 100%;
		z-index: 9;
		@if $debug {
			background-color: rgba(255, 255, 0, 0.5);
		}
	}
	.vertical-grabber {
		height: 100%;
		width: 1.2rem;
		z-index: 9;
		@if $debug {
			background-color: rgba(255, 255, 0, 0.5);
		}
	}
	.BR {
		//bottom right
		bottom: 0;
		right: 0;
		cursor: se-resize;
		transform: translate(0.5rem, 0.5rem);
	}
	.TR {
		//top right
		top: 0;
		right: 0;
		cursor: ne-resize;
		transform: translate(0.5rem, -0.5rem);
	}
	.BL {
		//bottom left
		bottom: 0;
		left: 0;
		cursor: sw-resize;
		transform: translate(-0.5rem, 0.5rem);
	}
	.TL {
		//top left
		top: 0;
		left: 0;
		cursor: nw-resize;
		transform: translate(-0.5rem, -0.5rem);
	}
	.TC {
		//top center
		top: 0;
		cursor: n-resize;
		transform: translate(0rem, -0.5rem);
	}
	.BC {
		//bottom center
		bottom: 0;
		cursor: s-resize;
		transform: translate(0rem, 0.5rem);
	}
	.LC {
		//left center
		left: 0;
		top: 0;
		cursor: w-resize;
		transform: translate(-0.5rem, 0rem);
	}
	.RC {
		//right center
		right: 0;
		top: 0;
		cursor: e-resize;
		transform: translate(0.5rem, 0rem);
	}
	.dockable-resize {
		position: absolute;
	}

	@if $debug {
		.dragging {
			background-color: rgba(0, 255, 0, 0.5);
		}
	}

	.dockable-icon {
		display: flex;
		flex-wrap: hide;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 0rem;
		line-height: 25px;
	}
	.dockable-icon div svg {
		height: 100%;
	}
	.dockable-icon div {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		width: 25px;
		height: 25px;
	}
	.dockable-icon div:hover {
		color: rgba(255, 0, 0, 0.8);
	}

	.dockable-tools {
		display: flex;
		height: 100%;
		padding: 0.5rem;
		border-radius: 5px 5px 0 0;
		object-fit: contain;
		box-sizing: border-box;
		background-clip: border-box;
		justify-content: space-between;
		flex-wrap: hide;
		background-color: var(--color);
	}
</style>
