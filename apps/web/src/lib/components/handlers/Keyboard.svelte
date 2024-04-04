<script lang="ts">
	import type { ControllerData } from 'robot/dist/controller';

	const defaultData = {
				connected: true,
				id: "keyboard",
				mainAxes: {
					x: 0,
					y: 0
				},
				secondaryAxes: {
					x: 0,
					y: 0				},
				yaw: 0,
				trigger: false,
				buttons: {
					leftSmall: false,
					rightSmall: false,
					leftBig: false,
					rightBig: false, 
					bottomBig: false,
					bottomSmall: false
				}
			};

	export let output: ControllerData = structuredClone(defaultData);

	let pressedKeys: Set<string> = new Set();

	const mapping: Record<string, () => void> = {
		w: () => (output.mainAxes.y = 1),
		s: () => (output.mainAxes.y = -1),
		d: () => (output.mainAxes.x = 1),
		a: () => (output.mainAxes.x = -1),
		i: () => (output.secondaryAxes.y = 1),
		k: () => (output.secondaryAxes.y = -1),
		j: () => (output.yaw = -1),
		l: () => (output.yaw = 1)
	};

	function update() {
		output = structuredClone(defaultData);
		for (const key of pressedKeys) {
			mapping[key]?.();
		}
	}

	function keydownEvent(event: KeyboardEvent) {
		pressedKeys.add(event.key);
		update();
	}

	function keyupEvent(event: KeyboardEvent) {
		pressedKeys.delete(event.key);
		update();
	}
</script>

<svelte:window on:keydown={keydownEvent} on:keyup={keyupEvent} />
