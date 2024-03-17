<script lang="ts">
    import { move } from "robot/src/thrusters";
    import * as vector from 'vector';

    let directionX = 0;
    let directionY = 0;
    let directionZ = 0;
    $: neutralDirection = directionX === 0 && directionY === 0 && directionZ === 0;

    function resetDirection() {
        directionX = 0;
        directionY = 0;
        directionZ = 0;
    }

    let torqueX = 0;
    let torqueY = 0;
    let torqueZ = 0;
    $: neutralTorque = torqueX === 0 && torqueY === 0 && torqueZ === 0;

    function resetTorque() {
        torqueX = 0;
        torqueY = 0;
        torqueZ = 0;
    }
</script>

<h1>Optimal Motor Placements</h1>

<h2>
    Direction
    {#if !neutralDirection}
        <button on:click={resetDirection}>Reset</button>
    {/if}
</h2>

<div>
    <label for="directionX">X</label>
    <input type="range" min="-1" max="1" step="0.01" id="directionX" bind:value={directionX} />
</div>
<div>
    <label for="directionY">Y</label>
    <input type="range" min="-1" max="1" step="0.01" id="directionY" bind:value={directionY} />
</div>
<div>
    <label for="directionZ">Z</label>
    <input type="range" min="-1" max="1" step="0.01" id="directionZ" bind:value={directionZ} />
</div>

<h2>
    Torque
    {#if !neutralTorque}
        <button on:click={resetTorque}>Reset</button>
    {/if}
</h2>

<div>
    <label for="torqueX">X</label>
    <input type="range" min="-1" max="1" step="0.01" id="torqueX" bind:value={torqueX} />
</div>
<div>
    <label for="torqueY">Y</label>
    <input type="range" min="-1" max="1" step="0.01" id="torqueY" bind:value={torqueY} />
</div>
<div>
    <label for="torqueZ">Z</label>
    <input type="range" min="-1" max="1" step="0.01" id="torqueZ" bind:value={torqueZ} />
</div>

<pre>
    {JSON.stringify(move(
        vector.vector(directionX, directionY, directionZ),
        vector.vector(torqueX, torqueY, torqueZ),
    ), null, 2)}
</pre>

<style>
    div {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
</style>
