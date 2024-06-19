<script lang="ts" generics="T extends z.ZodTypeAny">
	import { z } from 'zod';
	import { zodToJsonSchema } from 'zod-to-json-schema';
	import { tooltip } from '@svelte-plugins/tooltips';

	export let jsonSchema: ReturnType<typeof zodToJsonSchema>;
	export let data: z.infer<T>;
	export let tabAmount = 0;

	let jsonSchemaIsh: any;
	$: jsonSchemaIsh = jsonSchema;
</script>

{#if typeof data === 'boolean'}
	{#if data}
		<span class="true">true</span>
	{:else}
		<span class="false">false</span>
	{/if}
{:else if typeof data === 'number'}
	<span class="number">{data}</span>
{:else if typeof data === 'string'}
	<span class="string">"{data}"</span>
{:else if typeof data === 'object' && !Array.isArray(data) && data !== null}
	{#each Object.entries(data) as [key, value]}
		<p>
			{'\t'.repeat(tabAmount)}<span
				class="key"
				use:tooltip={{ theme: 'main-tooltip', content: jsonSchemaIsh.properties[key].description }}
				>{key}</span
			>: <svelte:self
				data={value}
				jsonSchema={jsonSchemaIsh.properties[key]}
				tabAmount={tabAmount + 1}
			/>
		</p>
	{/each}
{/if}

<style lang="scss">
	.key {
		color: var(--accent);
		border-bottom: 2px dotted var(--accent);
	}

	:global(.main-tooltip) {
		font-family: 'JetBrains Mono Variable', monospace !important;
		font-weight: 200 !important;
	}

	.string {
		color: yellow;
	}

	.true {
		color: green;
	}

	.false {
		color: red;
	}

	.number {
		color: var(--secondary);
	}
</style>
