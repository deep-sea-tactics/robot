<script lang="ts">
	import type { ControllerData } from 'robot/dist/controller';

	const defaultData = {
		connected: true,
		id: 'keyboard',
		stickAxes: {
			leftStick: {
				x: 0,
				y: 0
			},
			rightStick: {
				x: 0,
				y: 0
			}
		},
		stickButtons: {
			leftStick: false,
			rightStick: false
		},
		bumbers: {
			left: false,
			right: false
		},
		triggers: {
			left: false,
			right: false
		},
		shapeButtons: {
			up: false,
			down: false,
			left: false,
			right: false
		}
	};

	export let output: ControllerData = structuredClone(defaultData);

	let pressedKeys: Set<string> = new Set();

	const mapping: Record<string, () => void> = {
		w: () => (output.stickAxes.leftStick.y = 1),
		s: () => (output.stickAxes.leftStick.y = -1),
		d: () => (output.stickAxes.leftStick.x = 1),
		a: () => (output.stickAxes.leftStick.x = -1),
		i: () => (output.stickAxes.rightStick.y = 1),
		k: () => (output.stickAxes.rightStick.y = -1),
		j: () => (output.stickAxes.rightStick.x = -1),
		l: () => (output.stickAxes.rightStick.x = 1)
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
