import { initTRPC } from '@trpc/server';
import { type ControllerData, controllerDataSchema, defaultControllerData } from './controller.js';
import debounce from 'debounce';
import { observable } from '@trpc/server/observable';
import { Motor } from './motor.js';
import { vectorSchema } from './sensors.js';
import type { MotorEvent } from './motor.js';
import { move } from './thrusters.js';
import { type Events, emitter } from './emitter.js';
import { calculateNeededTorque } from './stable.js';
import { asyncExitHook } from 'exit-hook';
import readline from 'node:readline';
import { stdin, stdout } from 'node:process';

const t = initTRPC.create();

const isMock = process.env.MOCK === 'true';

const sleep = (time: number): Promise<void> => new Promise(resolve => setInterval(resolve, time));

async function connectPhysicalMotors() {
	const { Gpio } = await import('pigpio');

	const thrusterConfig = {
		// ESC 1 - pin 33
		[Motor.TopLeft]: new Gpio(13, { mode: Gpio.OUTPUT }),
		// ESC 2 - pin 32
		[Motor.VerticalRight]: new Gpio(12, { mode: Gpio.OUTPUT }),
		// ESC 3 - pin 31
		[Motor.BottomRight]: new Gpio(6, { mode: Gpio.OUTPUT }),
		// ESC 4 - pin 29
		[Motor.BottomLeft]: new Gpio(5, { mode: Gpio.OUTPUT }),
		// ESC 5 - pin 36
		[Motor.TopRight]: new Gpio(16, { mode: Gpio.OUTPUT }),
		// ESC 6 - pin 35
		[Motor.VerticalLeft]: new Gpio(19, { mode: Gpio.OUTPUT })
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

	for (const motor of Object.values(thrusterConfig)) {
		motor.servoWrite(0);
	}

	await sleep(1000);

	for (const motor of Object.values(thrusterConfig)) {
		motor.servoWrite(1500);
	}

	await sleep(2000);

	/** Converts speed to servo, where speed is constrained to [-1, 1] */
	function speedToServo(speed: number) {
		// 1100 - 1900, 1500 is neutral
		return Math.max(Math.min(1900, speed * ((1900 - 1100) / 2) + 1500), 1100);
	}

	function onMotorData(event: Record<`${Motor}`, number>) {
		// magnitude = square root of the dot product of the vector and itself again
		const motorMagnitude = Math.sqrt(
			Object.values(event).map(x => x * x).reduce((a, b) => a + b, 0)
		)

		// TODO: move to linear logic, variable control
		const normalizedEntries = Object.entries(event).map(([motor, speed]) => {
			return [
				motor,
				motorMagnitude == 0 ? 1 : speed / motorMagnitude
			] as const
		})
		for (const [motor, speed] of normalizedEntries) {
			const pin = thrusterConfig[parseInt(motor) as Motor];
			console.log(speed, speedToServo(speed));
			pin.servoWrite(Math.round(speedToServo(speed)));
		}
	}

	emitter.on('motorData', onMotorData);

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
			console.log("Cleaning up...");
			await cleanup();
			console.log("Bye!");
			process.exit(0);
		} else {
			rl.question('Shutdown? (y[es]) ', runPrompt);
		}
	}

	runPrompt('');

	// Clean up on sig signals (doesn't work in NX? https://github.com/nrwl/nx/issues/18255)
	asyncExitHook(async () => {
		console.log('Cleaning up...');
		await cleanup();
		console.log('Bye!');
		process.exit(0);
	}, { wait: 1000 });
}

if (!isMock) {
	connectPhysicalMotors();
}

const emit: <U extends keyof Events>(event: U) => (...args: Parameters<Events[U]>) => void =
	(event) =>
	(...data) =>
		emitter.emit(event, ...data);

let movement: ControllerData = defaultControllerData;

function tick() {
	const movementCalc = move(movement.movement, calculateNeededTorque(movement.rotation));

	emitter.emit(
		'motorData',
		Object.fromEntries(
			movementCalc.motors.map((motor) => [motor.type.toString(), motor.speed])
		) as Record<`${Motor}`, number>
	);
}

export const queueTick = () => setInterval(tick, 60);

emitter.on('controllerData', (data) => {
	movement = data;
});

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
	motorEvent: t.procedure.subscription(() => {
		return observable<MotorEvent>((emit) => {
			const onAdd = (data: Record<`${Motor}`, number>) =>
				Object.entries(data).forEach(([motor, speed]) =>
					emit.next({ motor: parseInt(motor), speed })
				);

			emitter.on('motorData', onAdd);

			return () => {
				emitter.off('motorData', onAdd);
			};
		});
	})
});

export type RobotRouter = typeof router;
