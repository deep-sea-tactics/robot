import { initTRPC } from '@trpc/server';
import { controllerDataSchema } from './controller.js';
import debounce from 'debounce';
import { observable } from '@trpc/server/observable';
import { TypedEmitter } from 'tiny-typed-emitter';
import { Motor } from './motor.js';
import { accelerationDataSchema, type AccelerationData, gyroDataSchema, type GyroData } from './sensors.js';
import type { ControllerData } from './controller.js';
import type { MotorEvent } from './motor.js';
import { move } from './thrusters.js';
import * as vector from 'vector';

type Events = {
	controllerData: (data: ControllerData) => void;
	motorData: (data: MotorEvent) => void;
	simulationAccelerationData: (data: AccelerationData) => void;
	simulationGyroData: (data: GyroData) => void;
};

const emitter = new TypedEmitter<Events>();

const t = initTRPC.create();

const isMock = process.env.MOCK === 'true';

function updateSimulationAccelerationData(data: AccelerationData) {
	emitter.emit('simulationAccelerationData', data);
}

function updateGyroscopeData(data: GyroData) {
	emitter.emit('simulationGyroData', data);
}

function updateControllerData(data: ControllerData) {
	emitter.emit('controllerData', data);
}

// TODO: on sigint, stop all motors

emitter.on('controllerData', (data) => {
	const movement = move(
		{
			x: data.stickAxes.leftStick.x,
			y: 0,
			z: data.stickAxes.leftStick.y
		},
		vector.vector(0, 0, 0)
	);

	emitter.emit('motorData', {
		motor: Motor.BottomLeft,
		speed: movement.motors.find((m) => m.type === Motor.BottomLeft)?.speed ?? 0
	});

	emitter.emit('motorData', {
		motor: Motor.BottomRight,
		speed: movement.motors.find((m) => m.type === Motor.BottomRight)?.speed ?? 0
	});

	emitter.emit('motorData', {
		motor: Motor.TopLeft,
		speed: movement.motors.find((m) => m.type === Motor.TopLeft)?.speed ?? 0
	});

	emitter.emit('motorData', {
		motor: Motor.TopRight,
		speed: movement.motors.find((m) => m.type === Motor.TopRight)?.speed ?? 0
	});

	// TODO: up and down - need to figure out view
	let verticalSpeed = 0;
	if (data.stickButtons.leftStick) {
		verticalSpeed = 1;
	} else if (data.stickButtons.rightStick) {
		verticalSpeed = -1;
	}
	emitter.emit('motorData', {
		motor: Motor.VerticalLeft,
		speed: verticalSpeed
	});

	// TODO: yaw (rotation)
	// TODO: camera position (throttle)
});

export const router = t.router({
	simulationAccelerationData: t.procedure.input(accelerationDataSchema).mutation(({ input }) => {
		updateSimulationAccelerationData(input);
		return input;
	}),
	simulationGyroscopeData: t.procedure.input(gyroDataSchema).mutation(({ input }) => {
		updateGyroscopeData(input);
		return input;
	}),
	controllerData: t.procedure.input(controllerDataSchema).mutation(({ input }) => {
		debounce(updateControllerData, 50)(input);
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
