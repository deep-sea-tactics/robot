import { TypedEmitter } from 'tiny-typed-emitter';
import type { ControllerData } from './controller.js';
import type { Thruster } from './thruster.js';
import type { Vector } from 'vector';

export interface Events {
	controllerData(data: ControllerData): void;
	/** Record of <thrusterName, the speed from 0-1> */
	thrusterData(data: Record<`${Thruster}`, number>): void;
	/** where the pulse width is from 1100-1900 */
	servoThrusterData(thruster: `${Thruster}`, pulseWidth: number): void;
	simulationAccelerationData(data: Vector): void;
	simulationGyroData(data: [timestamp: number, vector: Vector]): void;
};

export const emitter = new TypedEmitter<Events>();
