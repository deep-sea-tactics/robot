import { TypedEmitter } from 'tiny-typed-emitter';
import type { ControllerData } from './controller.js';
import type { Motor } from './motor.js';
import type { Vector } from 'vector';

export type Events = {
	controllerData(data: ControllerData): void;
	/** Record of <motorName, the speed from 0-1> */
	motorData(data: Record<`${Motor}`, number>): void;
	simulationAccelerationData(data: Vector): void;
	simulationGyroData(data: [timestamp: number, vector: Vector]): void;
};

export const emitter = new TypedEmitter<Events>();
