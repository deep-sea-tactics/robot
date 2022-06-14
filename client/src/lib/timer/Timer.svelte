<script lang="ts">
  import { times } from "./timer"

  setInterval(() => {
    $times = $times.map(({ time, active }) => ({ time: time <= 0 ? 0 : time - 1, active }))
  }, 1000)

  let editableSeconds = 0
</script>

{#if $times.length !== 0}
  {#each $times as { active, time }}
    <span>{time}</span>
    {#if active}
      <button on:click={() => active = false}>Stop</button>
    {:else}
      <button on:click={() => active = true}>Start</button>
    {/if}
  {/each}
  <br>
{/if}
<!-- TODO minutes -->
<input placeholder="Seconds" bind:value={editableSeconds}>
<button on:click={() => {
  $times = [...$times, { time: editableSeconds }]
  editableSeconds = 0
}}>Add new timer</button>