import { initTRPC } from '@trpc/server';
import { ControllerData, ControllerDataSchema } from './controller.js';
import debounce from 'debounce';
import { observable } from '@trpc/server/observable';
import { TypedEmitter } from 'tiny-typed-emitter';

export enum Motor {
  /** Motor on the left that moves the robot side to side */
  SideLeft,
  /** Motor on the right that moves the robot side to side */
  SideRight,
  /** Motor on the left that moves the robot forward and backward */
  FrontLeft,
  /** Motor on the right that moves the robot forward and backward */
  FrontRight,
  /** Motor on the left that moves the robot up and down */
  TopLeft,
  /** Motor on the right that moves the robot up and down */
  TopRight
}

export interface MotorEvent {
  /** The motor to move */
  motor: Motor;
  /** The speed to move the motor at, between -1 and 1 */
  speed: number;
}

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

emitter.on('controllerData', (data) => {
  if (isMock) return;

  emitter.emit('motorData', {
    motor: Motor.SideLeft,
    speed: data.position.x
  });

  emitter.emit('motorData', {
    motor: Motor.SideRight,
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
  controllerData: t.procedure.input(ControllerDataSchema).query(({ input }) => {
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
