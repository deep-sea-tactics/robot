import { initTRPC } from '@trpc/server';
import { controllerDataSchema } from './controller.js';
import debounce from 'debounce';
import { observable } from '@trpc/server/observable';
import { Motor } from './motor.js';
import {
	vectorSchema
} from './sensors.js';
import type { ControllerData } from './controller.js';
import type { MotorEvent } from './motor.js';
import { move } from './thrusters.js';
import * as vector from 'vector';
import { setCurrentRotation } from './stable.js';
import { Events, emitter } from './emitter.js';

const t = initTRPC.create();

const isMock = process.env.MOCK === 'true';

const emit: <U extends keyof Events>(event: U) => ((...args: Parameters<Events[U]>) => void) 
	= event => (...data) => emitter.emit(event, ...data)

emitter.on('controllerData', (data) => {
	const movement = move(
		{
			x: data.mainAxes.x,
			y: data.mainAxes.y,
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

});

export const router = t.router({
	simulationAccelerationData: t.procedure.input(vectorSchema).mutation(({ input }) => {
		emit('simulationAccelerationData')(input);
		return input;
	}),
	simulationGyroscopeData: t.procedure.input(vectorSchema).mutation(({ input }) => {
		emit('simulationGyroData')(input);
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
