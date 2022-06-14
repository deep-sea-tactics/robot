<script lang="ts">
  import { times } from "./timer"
  import evaulate from "math-expression-evaluator"

  let editableSeconds = "0"
</script>

{#if $times.length !== 0}
  {#each $times as { active, time }}
    <span>{time}</span>
    {#if active}
      <button on:click={() => active = false}>Stop</button>
    {:else}
      <button on:click={() => active = true}>Start</button>
    {/if}
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