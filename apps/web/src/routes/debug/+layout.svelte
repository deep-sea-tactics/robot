<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import PhWrenchFill from '~icons/ph/wrench-fill';
	import PhSpeedometerFill from '~icons/ph/speedometer-fill';
	import PhGameControllerFill from '~icons/ph/game-controller-fill';
	import PhMathOperationsFill from '~icons/ph/math-operations-fill';
	import PhSpinnerBallFill from '~icons/ph/spinner-ball-fill';
</script>

<div class="container">
	<header>
		<h1>
			<b
				><a class="titleLink" class:active={$page.url.toString().endsWith('/debug')} href="{base}/debug"
					>ROV Debugger</a
				></b
			>
			<PhWrenchFill />
		</h1>

		<div class="links">
			<a class:active={$page.url.toString().includes('/debug/thruster')} href="{base}/debug/thruster"
				>Thruster <PhSpeedometerFill /></a
			>
			<a class:active={$page.url.toString().includes('/debug/controller')} href="{base}/debug/controller"
				>Controller <PhGameControllerFill /></a
			>
			<a
				class:active={$page.url.toString().includes('/debug/control-matrix')}
				href="{base}/debug/control-matrix">Control Matrix <PhMathOperationsFill /></a
			>
			<a
				class:active={$page.url.toString().includes('/debug/servo')}
				href="{base}/debug/servo">Servo <PhSpinnerBallFill /></a
			>
		</div>
	</header>

	<div class="body">
		<slot />
	</div>
</div>

<style lang="scss">
	:global(body) {
		background-color: var(--background);
		color: var(--foreground);
	}

	:global(html, body) {
		height: 100%;
		margin: 0;
		padding: 0;
	}

	h1 {
		display: flex;
		gap: 1rem;
	}

	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.body {
		width: calc(100% - 2rem);
		height: calc(100% - 2rem);
		margin: 1rem;
	}

	.links {
		display: flex;
		gap: 1rem;
	}

	header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid var(--foreground);

		.titleLink {
			color: var(--foreground);

			&.active {
				color: var(--accent);
			}
		}

		.links a {
			background-color: var(--foreground);
			color: var(--background);
			padding: 2px 4px;
			display: flex;
			gap: 0.5rem;
			align-items: center;

			&:hover {
				background-color: var(--tertiary);

				@media (prefers-color-scheme: light) {
					background-color: var(--secondary);
				}
			}

			&.active {
				background-color: var(--accent);
			}
		}
	}
</style>
