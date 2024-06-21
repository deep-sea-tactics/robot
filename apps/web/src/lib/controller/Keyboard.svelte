<script lang="ts">
	import { type ControllerData, controllerDataSchema } from 'robot/src/controller';

	const defaultKeyboardData: ControllerData = Object.freeze({
		...controllerDataSchema.parse(undefined),
		connected: true,
		id: 'keyboard'
	});

	export let output: ControllerData = structuredClone(defaultKeyboardData);

	let pressedKeys: Set<string> = new Set();

	const speed = 0.25;

	const mapping: Record<string, () => void> = {
		w: () => (output.movement.z = speed),
		s: () => (output.movement.z = -speed),
		d: () => (output.movement.x = -speed),
		a: () => (output.movement.x = speed),
		i: () => (output.movement.y = speed),
		k: () => (output.movement.y = -speed),
		j: () => (output.rotation.yaw = -speed),
		l: () => (output.rotation.yaw = speed),
		f: () => (output.rotation.pitch = speed),
		v: () => (output.rotation.pitch = -speed),
		'.': () => (output.tasks.pinkSquare = true),
		'/': () => (output.tasks.scanning = true),
		'[': () => (output.arm.rotate = -speed),
		']': () => (output.arm.rotate = speed),
		'-': () => (output.arm.openClose = -speed),
		'=': () => (output.arm.openClose = speed)
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
