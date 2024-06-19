<script lang="ts">
	import { type ControllerData, controllerDataSchema } from 'robot/src/controller';

	const defaultKeyboardData: ControllerData = Object.freeze({
		...controllerDataSchema.parse(undefined),
		connected: true,
		id: 'keyboard'
	});

	export let output: ControllerData = structuredClone(defaultKeyboardData);

	let pressedKeys: Set<string> = new Set();

	const mapping: Record<string, () => void> = {
		w: () => (output.movement.z = 1),
		s: () => (output.movement.z = -1),
		d: () => (output.movement.x = -1),
		a: () => (output.movement.x = 1),
		i: () => (output.movement.y = 1),
		k: () => (output.movement.y = -1),
		j: () => (output.rotation.yaw = -1),
		l: () => (output.rotation.yaw = 1),
		f: () => (output.rotation.pitch = 1),
		v: () => (output.rotation.pitch = -1),
		',': () => (output.tasks.pinkSquare = true),
		'/': () => (output.tasks.scanning = true)
	};

	function update() {
		output = structuredClone(defaultKeyboardData);
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
