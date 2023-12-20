import { initTRPC } from '@trpc/server';
import { ControllerData, ControllerDataSchema } from './controller.js';
import debounce from 'debounce';
import { observable } from '@trpc/server/observable';
import { TypedEmitter } from 'tiny-typed-emitter';
import { Motor, MotorEvent } from './motor.js';

type Events = {
	controllerData: (data: ControllerData) => void;
	motorData: (data: MotorEvent) => void;
};

const emitter = new TypedEmitter<Events>();

const t = initTRPC.create();

const isMock = process.env.MOCK === 'true';

function updateControllerData(data: ControllerData) {
	emitter.emit('controllerData', data);
}

// TODO: on sigint, stop all motors
emitter.on('controllerData', (data) => {
	emitter.emit('motorData', {
		motor: Motor.SideFront,
		speed: data.position.x
	});

	emitter.emit('motorData', {
		motor: Motor.SideBack,
		speed: data.position.x
	});

	emitter.emit('motorData', {
		motor: Motor.FrontLeft,
		speed: data.position.y
	});

	emitter.emit('motorData', {
		motor: Motor.FrontRight,
		speed: data.position.y
	});

	// TODO: up and down - need to figure out view
	// TODO: yaw (rotation)
	// TODO: camera position (throttle)
});

export const router = t.router({
	controllerData: t.procedure.input(ControllerDataSchema).mutation(({ input }) => {
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