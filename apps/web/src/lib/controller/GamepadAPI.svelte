<script lang="ts">
	import { onMount } from 'svelte';
	import { controllerDataSchema, type ControllerData } from 'robot/src/controller';
	import { UAParser } from 'ua-parser-js';

	type DebrandedControllerData = Omit<ControllerData, symbol>;

	type OperatingSystem = 'unix' | 'windows';
	// i hate safari
	type Browser = 'firefox' | 'chromium';

	type Platform = `${OperatingSystem}-${Browser}`;

	export let gamepad: Gamepad | null = null;
	export let output: ControllerData | null = null;
	export let idContains: string;
	export let gamepadToConfig: Partial<Record<Platform, (gamepad: Gamepad) => DebrandedControllerData>>;

	let animationFrame: number | undefined;
	let operatingSystem: OperatingSystem | undefined;
	let browser: Browser | undefined;

	onMount(() => {
		const parser = new UAParser(navigator.userAgent);

		browser = parser.getBrowser().name?.toLowerCase().includes('firefox') ? 'firefox' : 'chromium';
		operatingSystem = parser.getOS().name?.toLowerCase().includes('windows') ? 'windows' : 'unix';
		console.log(browser, operatingSystem)

		animationFrame = requestAnimationFrame(getInput);

		return () => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	});

	function getInput() {
		if (!browser || !operatingSystem) return;

		if (navigator.getGamepads().length < 1) {
			console.warn('No controller connected');
			output = null;
			animationFrame = requestAnimationFrame(getInput);
			return;
		}

		gamepad =
			navigator
				.getGamepads()
				.find((gamepadIter) => gamepadIter?.id.toLowerCase().includes(idContains.toLowerCase())) ??
			null;

		if (!gamepad) {
			output = null;
			animationFrame = requestAnimationFrame(getInput);
			return;
		}

		const config = gamepadToConfig[`${operatingSystem}-${browser}`];

		if (!config) {
			console.warn(`No config found for ${operatingSystem}-${browser}.`);
			return;
		}
		
		output = controllerDataSchema.parse(config(gamepad));

		animationFrame = requestAnimationFrame(getInput);
	}
</script>
