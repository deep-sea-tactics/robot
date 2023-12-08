<svelte:head>
  <title>Controller Debugging</title>
</svelte:head>

<script lang="ts">
    import Controller from "$lib/components/Controller.svelte";
    import type { ControllerData } from "robot/dist/controller";

    let output: ControllerData;
</script>

<Controller bind:output />

<pre>{JSON.stringify(output,null,2)}</pre>
