<script lang="ts">
	import type { ControllerData } from 'robot/dist/controller';
	import LogitechController from './LogitechController.svelte';
	import LogitechFlight from './LogitechFlight.svelte';
	import Keyboard from './Keyboard.svelte';

	export let logitechControllerOutput: ControllerData | undefined = undefined;
	export let logitechFlightOutput: ControllerData | undefined = undefined;
	export let keyboardOutput: ControllerData | undefined = undefined;

	export let output: ControllerData | undefined;
	$: output = logitechControllerOutput || logitechFlightOutput || keyboardOutput;
</script>

<LogitechController bind:output={logitechControllerOutput} />
<LogitechFlight bind:output={logitechFlightOutput} />
<Keyboard bind:output={keyboardOutput} />
