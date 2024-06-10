<script lang="ts" context="module">
	export type Icon = typeof SvelteComponent<SvelteHTMLElements['svg']>;
</script>

<script lang="ts">
	import type { ControllerData } from 'robot/dist/controller';
	import LogitechController from './LogitechController.svelte';
	import LogitechFlight from './LogitechFlight.svelte';
	import Keyboard from './Keyboard.svelte';

	import SimpleIconsLogitechg from '~icons/simple-icons/logitechg';
	import PhGameControllerFill from '~icons/ph/game-controller-fill';
	import PhAirplaneInFlightFill from '~icons/ph/airplane-in-flight-fill';
	import PhKeyboardFill from '~icons/ph/keyboard-fill';
	import type { SvelteComponent } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	export let logitechControllerOutput: ControllerData | undefined = undefined;
	export let logitechFlightOutput: ControllerData | undefined = undefined;
	export let keyboardOutput: ControllerData | undefined = undefined;

	const iconMapping: Record<string, Icon[]> = {
		logitechController: [SimpleIconsLogitechg, PhGameControllerFill],
		logitechFlight: [SimpleIconsLogitechg, PhAirplaneInFlightFill],
		keyboard: [PhKeyboardFill]
	};

	export let output: ControllerData | undefined;
	$: output = logitechFlightOutput || logitechControllerOutput || keyboardOutput;

	export let icons: Icon[] | undefined = undefined;
	$: icons = (
		logitechFlightOutput ? iconMapping.logitechFlight
			: logitechControllerOutput ? iconMapping.logitechController
			: keyboardOutput ? iconMapping.keyboard
			: undefined
	)
</script>

<LogitechController bind:output={logitechControllerOutput} />
<LogitechFlight bind:output={logitechFlightOutput} />
<Keyboard bind:output={keyboardOutput} />
