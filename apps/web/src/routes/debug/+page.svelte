<script lang="ts">
	import { env } from '$env/dynamic/public';
	const isMock = env.VITE_MOCK === 'true';
</script>

<h1>Welcome to the <b>ROV Debugger!</b></h1>

<p>To get started, click on one of the tabs above.</p>

{#if isMock}
	<p>This robot instance is running on mock mode (<code>pnpm run dev:mock</code>).</p>
{:else}
	<p><b class="warning">WARNING</b>: This robot instance is running on production (<code>pnpm run dev</code>).</p>
{/if}

<style lang="scss">
	.warning {
		color: yellow;
	}

	code {
		background-color: rgb(0, 0, 0);
		padding: 0.25rem 0.5rem;
		color: var(--secondary);
	}
</style>
