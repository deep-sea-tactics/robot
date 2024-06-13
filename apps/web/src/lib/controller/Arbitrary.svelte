<script lang="ts" context="module">
	export type Icon = typeof SvelteComponent<SvelteHTMLElements['svg']>;
</script>

<script lang="ts">
	import type { ControllerData } from 'robot/src/controller';
	import LogitechController from './LogitechController.svelte';
	import LogitechFlight from './LogitechFlight.svelte';
	import LogitechDual from './LogitechDual.svelte';
	import Keyboard from './Keyboard.svelte';

	import SimpleIconsLogitechg from '~icons/simple-icons/logitechg';
	import PhGameControllerFill from '~icons/ph/game-controller-fill';
	import PhAirplaneInFlightFill from '~icons/ph/airplane-in-flight-fill';
	import PhKeyboardFill from '~icons/ph/keyboard-fill';
	import type { SvelteComponent } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	export let logitechControllerOutput: ControllerData | undefined = undefined;
	export let logitechFlightOutput: ControllerData | undefined = undefined;
	export let logitechDualOutput: ControllerData | undefined = undefined;
	export let keyboardOutput: ControllerData | undefined = undefined;

	const iconMapping: Record<string, Icon[]> = {
		logitechDualOutput: [SimpleIconsLogitechg, PhGameControllerFill],
		logitechController: [SimpleIconsLogitechg, PhGameControllerFill],
		logitechFlight: [SimpleIconsLogitechg, PhAirplaneInFlightFill],
		keyboard: [PhKeyboardFill]
	};

	export let output: ControllerData | undefined;
	$: output = logitechFlightOutput || logitechControllerOutput || logitechDualOutput || keyboardOutput;

	export let icons: Icon[] | undefined = undefined;
	$: icons = logitechFlightOutput
		? iconMapping.logitechFlight
		: logitechControllerOutput
			? iconMapping.logitechController
			: logitechDualOutput
				? iconMapping.logitechDualOutput
				: keyboardOutput
					? iconMapping.keyboard
				: undefined;
</script>

<LogitechController bind:output={logitechControllerOutput} />
<LogitechDual bind:output={logitechDualOutput} />
<LogitechFlight bind:output={logitechFlightOutput} />
<Keyboard bind:output={keyboardOutput} />
