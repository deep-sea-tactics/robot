<script lang="ts">
	import type { ControllerData } from 'robot/dist/controller';
	import LogitechController from './LogitechController.svelte';
	import LogitechFlight from './LogitechFlight.svelte';
	import Keyboard from './Keyboard.svelte';

	let logitechControllerOutput: ControllerData | undefined;
	let logitechFlightOutput: ControllerData | undefined;
	let keyboardOutput: ControllerData | undefined;

	export let output: ControllerData | undefined;
	$: output = logitechControllerOutput || logitechFlightOutput || keyboardOutput;
</script>

<LogitechController bind:output={logitechControllerOutput} />
<LogitechFlight bind:output={logitechFlightOutput} />
<Keyboard bind:output={keyboardOutput} />
