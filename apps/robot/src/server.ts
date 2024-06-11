import { initTRPC } from '@trpc/server';
import { type ControllerData, controllerDataSchema, defaultControllerData } from './controller.js';
import debounce from 'debounce';
import { observable } from '@trpc/server/observable';
import { Thruster } from './thruster.js';
import { vectorSchema } from './sensors.js';
import type { ThrusterEvent } from './thruster.js';
import { move } from './thrusterCalculations.js';
import { type Events, emitter } from './emitter.js';
import { calculateNeededTorque } from './stable.js';
import { asyncExitHook } from 'exit-hook';
import readline from 'node:readline';
import { stdin, stdout } from 'node:process';
import si from 'systeminformation';

const t = initTRPC.create();

const sleep = (time: number): Promise<void> => new Promise((resolve) => setInterval(resolve, time));

async function connectThrusters() {
	const { Gpio } = await import('pigpio');

	const thrusterConfig = {
		// ESC 1 - pin 33
		[Thruster.TopLeft]: new Gpio(13, { mode: Gpio.OUTPUT }),
		// ESC 2 - pin 32
		[Thruster.VerticalRight]: new Gpio(12, { mode: Gpio.OUTPUT }),
		// ESC 3 - pin 31
		[Thruster.BottomRight]: new Gpio(6, { mode: Gpio.OUTPUT }),
		// ESC 4 - pin 29
		[Thruster.BottomLeft]: new Gpio(5, { mode: Gpio.OUTPUT }),
		// ESC 5 - pin 36
		[Thruster.TopRight]: new Gpio(16, { mode: Gpio.OUTPUT }),
		// ESC 6 - pin 35
		[Thruster.VerticalLeft]: new Gpio(19, { mode: Gpio.OUTPUT })
	};

	const sensorConfig = {
		1: new Gpio(11, { mode: Gpio.OUTPUT }),
		// (2 is not soldered)
		2: new Gpio(12, { mode: Gpio.OUTPUT }),
		3: new Gpio(13, { mode: Gpio.OUTPUT }),
		// (4 is not soldered)
		4: new Gpio(15, { mode: Gpio.OUTPUT }),
		5: new Gpio(16, { mode: Gpio.OUTPUT })
	};

	for (const thruster of Object.values(thrusterConfig)) {
		thruster.servoWrite(0);
	}

	await sleep(1000);

	for (const thruster of Object.values(thrusterConfig)) {
		thruster.servoWrite(1500);
	}

	await sleep(2000);

	/** Converts speed to servo, where speed is constrained to [-1, 1] */
	function speedToServo(speed: number) {
		// 1100 - 1900, 1500 is neutral
		const min = 1100;
		const max = 1900;
		return Math.max(Math.min(max, speed * ((max - min) / 2) + (max + min) / 2), min);
	}

	function onThrusterData(event: Record<`${Thruster}`, number>) {
		for (const [thruster, speed] of Object.entries(event)) {
			const pin = thrusterConfig[thruster as Thruster];
			if (Number.isNaN(speed)) {
				console.warn(`Thruster ${thruster} attempted to write NaN`);
			} else {
				pin.servoWrite(Math.round(speedToServo(speed)));
			}
		}
	}

	emitter.on('thrusterData', onThrusterData);

	async function cleanup() {
		for (const pin of Object.values(thrusterConfig)) {
			pin.servoWrite(1500);
		}

		await sleep(500);
	}

	// Ask for cleanup
	const rl = readline.createInterface({ input: stdin, output: stdout });

	async function runPrompt(answer: string) {
		if (['y', 'yes'].includes(answer.toLocaleLowerCase())) {
			console.log('Cleaning up...');
			await cleanup();
			console.log('Bye!');
			process.exit(0);
		} else {
			rl.question('Shutdown? (y[es]) ', runPrompt);
		}
	}

	runPrompt('');

	// Clean up on sig signals (doesn't work in NX? https://github.com/nrwl/nx/issues/18255)
	asyncExitHook(
		async () => {
			console.log('Cleaning up...');
			await cleanup();
			console.log('Bye!');
			process.exit(0);
		},
		{ wait: 1000 }
	);
}

const emit: <U extends keyof Events>(event: U) => (...args: Parameters<Events[U]>) => void =
	(event) =>
	(...data) =>
		emitter.emit(event, ...data);

let movement: ControllerData = defaultControllerData;

function tick() {
	const movementCalc = move(movement.movement, calculateNeededTorque(movement.rotation));

	emitter.emit(
		'thrusterData',
		Object.fromEntries(
			movementCalc.thrusters.map((thruster) => [thruster.type.toString(), thruster.speed])
		) as Record<`${Thruster}`, number>
	);
}

export const queueTick = () => setInterval(tick, 60);

emitter.on('controllerData', (data) => {
	movement = data;
});

interface SystemInformation {
	cpuTemperature: number;
}

export const router = t.router({
	simulationAccelerationData: t.procedure.input(vectorSchema).mutation(({ input }) => {
		emit('simulationAccelerationData')(input);
		return input;
	}),
	simulationGyroscopeData: t.procedure.input(vectorSchema).mutation(({ input }) => {
		emit('simulationGyroData')([Date.now(), input]);
		return input;
	}),
	controllerData: t.procedure.input(controllerDataSchema).mutation(({ input }) => {
		debounce(emit('controllerData'), 50)(input);
		return input;
	}),
	systemInformation: t.procedure.subscription(() => {
		return observable<SystemInformation>((emit) => {
			setInterval(async () => {
				const cpuTemperature = await si.cpuTemperature().then(cpu => cpu.cores);
				console.log(cpuTemperature)
				emit.next({
					cpuTemperature: cpuTemperature[0]
				})
			}, 500);
		});
	}),
	thrusterEvent: t.procedure.subscription(() => {
		return observable<ThrusterEvent>((emit) => {
			const onAdd = (data: Record<`${Thruster}`, number>) =>
				Object.entries(data).forEach(([thruster, speed]) =>
					emit.next({ thruster: thruster as Thruster, speed })
				);

			emitter.on('thrusterData', onAdd);

			return () => {
				emitter.off('thrusterData', onAdd);
			};
		});
	})
});

export type RobotRouter = typeof router;
