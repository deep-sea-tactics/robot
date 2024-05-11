import { initTRPC } from '@trpc/server';
import { ControllerData, controllerDataSchema, defaultControllerData } from './controller.js';
import debounce from 'debounce';
import { observable } from '@trpc/server/observable';
import { Motor } from './motor.js';
import {
	vectorSchema
} from './sensors.js';
import type { MotorEvent } from './motor.js';
import { move } from './thrusters.js';
import { type Events, emitter } from './emitter.js';
import { calculateNeededTorque } from './stable.js';

const t = initTRPC.create();

const isMock = process.env.MOCK === 'true';

async function connectPhysicalMotors() {
	const { Gpio } = await import("pigpio");

	const thrusterConfig = {
		// ESC 1
		[Motor.VerticalLeft]: new Gpio(36, { mode: Gpio.OUTPUT }),
		// ESC 2
		[Motor.VerticalRight]: new Gpio(35, { mode: Gpio.OUTPUT }),
		// ESC 3
		[Motor.TopLeft]: new Gpio(33, { mode: Gpio.OUTPUT }),
		// ESC 4
		[Motor.TopRight]: new Gpio(32, { mode: Gpio.OUTPUT }),
		// ESC 5
		[Motor.BottomLeft]: new Gpio(31, { mode: Gpio.OUTPUT }),
		// ESC 6
		[Motor.BottomRight]: new Gpio(29, { mode: Gpio.OUTPUT }),
	}

	const sensorConfig = {
		1: new Gpio(11, { mode: Gpio.OUTPUT }),
		// (2 is not soldered)
		2: new Gpio(12, { mode: Gpio.OUTPUT }),
		3: new Gpio(13, { mode: Gpio.OUTPUT }),
		// (4 is not soldered)
		4: new Gpio(15, { mode: Gpio.OUTPUT }),
		5: new Gpio(16, { mode: Gpio.OUTPUT })
	}

	function speedToServo(speed: number) {
		// 1100 - 1900, 1500 is neutral
		// range is 800 - multiply by its range and add initial
		return speed * 800 + 1100
	}

	function onMotorData(event: Record<`${Motor}`, number>) {
		for (const entry of Object.entries(event)) {
			const [motor, speed] = entry;
			const pin = thrusterConfig[parseInt(motor) as Motor];
			pin.servoWrite(speedToServo(speed))
		}
	}

	emitter.on('motorData', onMotorData);

	// on CTRL + C, clean up
	process.on('SIGINT', () => {
		Object.values(thrusterConfig).forEach((pin) => {
			pin.servoWrite(1500);
			pin.digitalWrite(0);
		});

		process.exit();
	});
}

if (!isMock) {
	connectPhysicalMotors();
}

const emit: <U extends keyof Events>(event: U) => ((...args: Parameters<Events[U]>) => void)
	= event => (...data) => emitter.emit(event, ...data)

let movement: ControllerData = defaultControllerData;

function tick() {
	const movementCalc = move(
		movement.movement,
		calculateNeededTorque(movement.rotation)
	);

	emitter.emit('motorData', Object.fromEntries(movementCalc.motors.map(motor => [motor.type.toString(), motor.speed])) as Record<`${Motor}`, number>);
}

export const queueTick = () => setInterval(tick, 60)

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
			const onAdd = (data: Record<`${Motor}`, number>) => Object.entries(data).forEach(([motor, speed]) => emit.next({ motor: parseInt(motor), speed }));

			emitter.on('motorData', onAdd);

			return () => {
				emitter.off('motorData', onAdd);
			};
		});
	})
});

export type RobotRouter = typeof router;
