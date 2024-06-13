<script lang="ts">
	import * as vector from 'vector';
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import Arbitrary from '$lib/controller/Arbitrary.svelte';
	import type { ControllerData } from 'robot/src/controller';
	import {
		move,
		speedToServo,
		calculateForce,
		calculateTorque
	} from 'robot/src/thrusterCalculations';
	import {
		Pane,
		Point,
		Button,
		Checkbox,
		Folder,
		Slider,
		RotationEuler
	} from 'svelte-tweakpane-ui';
	import { getData } from 'thrusters/src/pwm';

	let direction = vector.vector(0, 0, 0);
	let torque = vector.vector(0, 0, 0);
	let unprocessedTorque = vector.vector(0, 0, 0);

	$: torque = vector.stabilize(vector.asTuple(unprocessedTorque).map(x => (x % Math.PI) / Math.PI) as [number, number, number])

	$: result = move(direction, torque);

	let useController = false;
	let output: ControllerData | undefined = undefined;

	const voltage = 19;

	$: actualForce = calculateForce(
		result.thrusters.map((thruster) => ({
			type: thruster.type,
			speed: getData(voltage, speedToServo(thruster.speed))[1]
		}))
	);

	$: actualTorque = calculateTorque(
		result.thrusters.map((thruster) => ({
			type: thruster.type,
			speed: getData(voltage, speedToServo(thruster.speed))[1]
		}))
	);

	$: if (useController) {
		if (output) {
			direction = vector.vector(output.movement.x, output.movement.y, output.movement.z);
			torque = vector.vector(output.rotation.pitch, output.rotation.yaw, torque.z);
		} else {
			direction = vector.vector(0, 0, 0);
			torque = vector.vector(0, 0, 0);
		}
	}

	let size: undefined = undefined;
</script>

<svelte:head>
	<title>ROV Thruster Debugger</title>
</svelte:head>

<Arbitrary bind:output />

<main>
	<h1>Thruster Calculation Debugging</h1>

	<div class="body">
		<div class="canvas">
			<div class="pane">
				<Pane title="Debugger" position="inline">
					<Point
						disabled={useController}
						bind:value={direction}
						label="Direction"
						step={0.01}
						min={-1}
						max={1}
					/>
					<Button
						disabled={useController}
						title="Reset Direction"
						on:click={() => (direction = vector.vector(0, 0, 0))}
					/>
					<RotationEuler disabled={useController} bind:value={unprocessedTorque} label="Torque" />
					<Point disabled value={torque} label="Processed Torque" />
					<Button
						disabled={useController}
						title="Reset Torque"
						on:click={() => (torque = vector.vector(0, 0, 0))}
					/>
					<Checkbox bind:value={useController} label="Use Controller" />
					<Folder title="Relative Output">
						{#each result.thrusters as { type, speed }}
							<Slider disabled value={speed} min={-1} max={1} label={type} />
						{/each}
						<Point disabled label="Direction Difference" value={result.directionDifference} />
						<Point disabled label="Torque Difference" value={result.torqueDifference} />
						<Point disabled label="Resulting Force" value={result.resultingForce} />
						<Point disabled label="Resulting Torque" value={result.resultingTorque} />
					</Folder>
					<Folder title="Absolute Output">
						{#each result.thrusters as { type, speed }}
							<Slider disabled value={speedToServo(speed)} min={1100} max={1900} label={type} />
						{/each}
						<Point disabled label="Resulting Actual Force" value={actualForce} />
						<Point disabled label="Resulting Actual Torque" value={actualTorque} />
					</Folder>
				</Pane>
			</div>
			<Canvas {size}>
				<Scene
					thrusters={result.thrusters}
					desiredDirection={direction}
					actualDirection={result.resultingForce}
					realForce={actualForce}
					realTorque={actualTorque}
				/>
			</Canvas>
		</div>
	</div>
</main>

<style>
	h1 {
		text-align: center;
	}

	.pane {
		position: absolute;
		top: 10px;
		left: 10px;
		border: 5px solid black;
	}

	.canvas {
		position: relative;
		border: 3px solid black;
		border-radius: 1rem;
		width: 100%;
		height: 100%;

		@media (prefers-color-scheme: dark) {
			border: 3px solid white;
		}
	}

	main {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	div.body {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		height: 100%;
		flex-grow: 1;
	}
</style>
