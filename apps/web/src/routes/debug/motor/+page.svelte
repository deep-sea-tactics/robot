<script lang="ts">
	import { move } from 'robot/src/thrusters';
	import * as vector from 'vector';
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import Arbitrary from '$lib/components/controller/Arbitrary.svelte';
	import type { ControllerData } from 'robot/src/controller';

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

	$: direction = vector.vector(directionX, directionY, directionZ);
	$: torque = vector.vector(torqueX, torqueY, torqueZ);
	$: result = move(direction, torque);

	let useController = false;
	let output: ControllerData | undefined = undefined;

	$: console.log(output)

	$: if (useController) {
		if (output) {
			directionX = output.movement.x;
			directionY = output.movement.y;
			directionZ = output.movement.z;

			torqueX = output.rotation.pitch;
			torqueY = output.rotation.yaw;
		} else {
			directionX = 0;
			directionY = 0;
			directionZ = 0;
			torqueX = 0;
			torqueY = 0;
			torqueZ = 0;
		}
	}
</script>

<svelte:head>
	<title>ROV Debugger</title>
</svelte:head>

<Arbitrary bind:output />

<main>
	<h1>Motor Calculation Debugging</h1>

	<div class="body">
		<div class="input">
			<h2>
				Direction
				{#if !neutralDirection}
					<button disabled={useController} on:click={resetDirection}>Reset</button>
				{/if}
			</h2>

			<p>[x: {directionX}, y: {directionY}, z: {directionZ}]</p>

			<div>
				<label for="directionX">X</label>
				<input disabled={useController} type="range" min="-1" max="1" step="0.01" id="directionX" bind:value={directionX} />
			</div>
			<div>
				<label for="directionY">Y</label>
				<input disabled={useController} type="range" min="-1" max="1" step="0.01" id="directionY" bind:value={directionY} />
			</div>
			<div>
				<label for="directionZ">Z</label>
				<input disabled={useController} type="range" min="-1" max="1" step="0.01" id="directionZ" bind:value={directionZ} />
			</div>

			<h2>
				Torque
				{#if !neutralTorque}
					<button disabled={useController} on:click={resetTorque}>Reset</button>
				{/if}
			</h2>

			<p>[x: {torqueX}, y: {torqueY}, z: {torqueZ}]</p>

			<div>
				<label for="torqueX">X</label>
				<input disabled={useController} type="range" min="-1" max="1" step="0.01" id="torqueX" bind:value={torqueX} />
			</div>
			<div>
				<label for="torqueY">Y</label>
				<input disabled={useController} type="range" min="-1" max="1" step="0.01" id="torqueY" bind:value={torqueY} />
			</div>
			<div>
				<label for="torqueZ">Z</label>
				<input disabled={useController} type="range" min="-1" max="1" step="0.01" id="torqueZ" bind:value={torqueZ} />
			</div>

			<label for="controller">Use Controller</label>
			<input id="controller" type="checkbox" bind:checked={useController}>
		</div>

		<div class="output">
			<h2>Motors</h2>
			{#each result.motors as { type, speed }}
				<p>{type}: {speed}</p>
			{/each}
			<pre><b>torque difference</b>: {JSON.stringify(result.torqueDifference, null,2)}</pre>
			<pre><b>direction difference</b>: {JSON.stringify(result.directionDifference, null,2)}</pre>

			<pre><b>resulting force</b>: {JSON.stringify(result.resultingForce, null,2)}</pre>
			<pre><b>resulting torque</b>: {JSON.stringify(result.resultingTorque, null,2)}</pre>
		</div>

		<div class="canvas">
			<Canvas>
				<Scene
					motors={result.motors}
					desiredDirection={direction}
					actualDirection={result.resultingForce}
				/>
			</Canvas>
		</div>
	</div>
</main>

<style>
	h1 {
		text-align: center;
	}

	.canvas {
		width: 400px;
		height: 400px;
		border: 3px solid black;
		border-radius: 1rem;

		@media (prefers-color-scheme: dark) {
			border: 3px solid white;
		}
	}

	div.body {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 1rem;
	}
</style>
