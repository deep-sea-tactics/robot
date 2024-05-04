import { initTRPC } from '@trpc/server';
import { controllerDataSchema } from './controller.js';
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
		[Motor.VerticalLeft]: new Gpio(19, { mode: Gpio.OUTPUT }),
		[Motor.VerticalRight]: new Gpio(16, { mode: Gpio.OUTPUT }),
		[Motor.TopLeft]: new Gpio(5, { mode: Gpio.OUTPUT }),
		[Motor.TopRight]: new Gpio(13, { mode: Gpio.OUTPUT }),
		[Motor.BottomLeft]: new Gpio(12, { mode: Gpio.OUTPUT }),
		[Motor.BottomRight]: new Gpio(6, { mode: Gpio.OUTPUT }),
	}

	function speedToServo(speed: number) {
		// 1100 - 1900, 1500 is neutral, range is 800 - multiply by its range and add initial
		return speed * 800 + 1100
	}

	function onMotorData(event: MotorEvent) {
		const pin = thrusterConfig[event.motor];
		
		pin.servoWrite(speedToServo(event.speed));
	}

	emitter.on('motorData', onMotorData)
}

if (!isMock) {
	connectPhysicalMotors();
}

const emit: <U extends keyof Events>(event: U) => ((...args: Parameters<Events[U]>) => void)
	= event => (...data) => emitter.emit(event, ...data)

interface Movement {
	x: number;
	/** up */
	y: number;
	z: number;
	yaw: number;
	pitch: number;
}

let movement: Movement = { x: 0, y: 0, z: 0, yaw: 0, pitch: 0 }

let lastTick = Date.now();
function tick() {
	const movementCalc = move(
		movement,
		calculateNeededTorque()
	);

	emitter.emit('motorData', {
		motor: Motor.BottomLeft,
		speed: movementCalc.motors.find((m) => m.type === Motor.BottomLeft)?.speed ?? 0
	});

	emitter.emit('motorData', {
		motor: Motor.BottomRight,
		speed: movementCalc.motors.find((m) => m.type === Motor.BottomRight)?.speed ?? 0
	});

	emitter.emit('motorData', {
		motor: Motor.TopLeft,
		speed: movementCalc.motors.find((m) => m.type === Motor.TopLeft)?.speed ?? 0
	});

	emitter.emit('motorData', {
		motor: Motor.TopRight,
		speed: movementCalc.motors.find((m) => m.type === Motor.TopRight)?.speed ?? 0
	});

	emitter.emit('motorData', {
		motor: Motor.VerticalLeft,
		speed: movementCalc.motors.find((m) => m.type === Motor.VerticalLeft)?.speed ?? 0
	});

	emitter.emit('motorData', {
		motor: Motor.VerticalRight,
		speed: movementCalc.motors.find((m) => m.type === Motor.VerticalRight)?.speed ?? 0
	});
}

export const queueTick = () => setInterval(tick, 60)

emitter.on('controllerData', (data) => {
	//how did we get here?
	movement = {
		x: data.mainAxes.y,
		y: (data.plusButtonCombo.up ? 1 : 0) - (data.plusButtonCombo.down ? 1 : 0) ,
		z: data.mainAxes.x,
		yaw: data.secondaryAxes.x,
		pitch: data.secondaryAxes.y
	}

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
			const onAdd = (data: MotorEvent) => emit.next(data);

			emitter.on('motorData', onAdd);

			return () => {
				emitter.off('motorData', onAdd);
			};
		});
	})
});

export type RobotRouter = typeof router;
