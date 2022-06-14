<script lang="ts">
  import { times, fancyTime } from "./timer"
  import evaulate from "math-expression-evaluator"
  import Icon from 'svelte-awesome';
  import trash from 'svelte-awesome/icons/trash';

  let editableSeconds = "0"
</script>

{#if $times.length !== 0}
  {#each $times as { active, time }, i}
    <span>{fancyTime(time)}</span>
    {#if active}
      <button on:click={() => active = false}>Stop</button>
    {:else}
      <button on:click={() => active = true}>Start</button>
    {/if}
    <button on:click={() => $times = $times.filter((_, index) => i !== index)}><Icon data={trash} class="hover:fill-red-700 transition-all"></Icon></button>
    <br/>
  {/each}
  <br>
{/if}
<!-- TODO minutes -->
<input placeholder="Seconds" bind:value={editableSeconds}>
<button on:click={() => {
  $times = [...$times, { time: parseInt(evaulate.eval(editableSeconds)) }]
  editableSeconds = "0"
}}>Add new timer</button>