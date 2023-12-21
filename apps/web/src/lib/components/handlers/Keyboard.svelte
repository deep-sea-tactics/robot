<script lang="ts">
	import type { ControllerData } from 'robot/dist/controller';

	const defaultData = {

	}

	export let output: ControllerData = structuredClone(defaultData);

	let pressedKeys: Set<string> = new Set();

	const mapping: Record<string, () => void> = {
		w: () => (output.position.y = 1),
		s: () => (output.position.y = -1),
		a: () => (output.position.x = -1),
		d: () => (output.position.x = 1)
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
