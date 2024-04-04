import { initTRPC } from '@trpc/server';
import { controllerDataSchema } from './controller.js';
import debounce from 'debounce';
import { observable } from '@trpc/server/observable';
import { Motor } from './motor.js';
import {
	accelerationDataSchema,
	type AccelerationData,
	gyroDataSchema,
	type GyroData
} from './sensors.js';
import type { ControllerData } from './controller.js';
import type { MotorEvent } from './motor.js';
import { move } from './thrusters.js';
import * as vector from 'vector';
import { setCurrentRotation } from './stable.js';
import { emitter } from './emitter.js';

const t = initTRPC.create();

const isMock = process.env.MOCK === 'true';

function updateSimulationAccelerationData(data: AccelerationData) {
	emitter.emit('simulationAccelerationData', data);
}

let currentRotation = vector.vector(0, 0, 0);

function updateGyroscopeData(data: GyroData) {
	emitter.emit('simulationGyroData', data);
	
	currentRotation = vector.vector(data.x, data.y, data.z);
	setCurrentRotation(currentRotation)
}

function updateControllerData(data: ControllerData) {
	emitter.emit('controllerData', data);
}

// TODO: on sigint, stop all motors

emitter.on('controllerData', (data) => {
	const movement = move(
		{
			x: data.mainAxes.x,
			y: data.mainAxes.y ? 1 : data.mainAxes.y ? -1 : 0,
			z: data.secondaryAxes.y
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

	emitter.emit('motorData', {
		motor: Motor.VerticalLeft,
		speed: movement.motors.find((m) => m.type === Motor.VerticalLeft)?.speed ?? 0
	});

	emitter.emit('motorData', {
		motor: Motor.VerticalRight,
		speed: movement.motors.find((m) => m.type === Motor.VerticalRight)?.speed ?? 0
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
