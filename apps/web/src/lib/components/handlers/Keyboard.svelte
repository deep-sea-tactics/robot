<script lang="ts">
	import type { ControllerData } from 'robot/dist/controller';

	const defaultData = {
		connected: true,
		axes: {
			leftStick: {
				x: 0,
				y: 0
			},
			rightStick: {
				x: 0,
				y: 0
			}
		}
	}

	export let output: ControllerData = structuredClone(defaultData);

	let pressedKeys: Set<string> = new Set();

	const mapping: Record<string, () => void> = {
		w: () => (output.axes.leftStick.y = 1),
		s: () => (output.axes.leftStick.y = -1),
		a: () => (output.axes.leftStick.x = -1),
		d: () => (output.axes.leftStick.x = 1),
		i: () => (output.axes.rightStick.y = 1),
		k: () => (output.axes.rightStick.y = -1),
		j: () => (output.axes.rightStick.x = -1),
		l: () => (output.axes.rightStick.x = 1)
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
