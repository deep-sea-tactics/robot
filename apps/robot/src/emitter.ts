import { TypedEmitter } from "tiny-typed-emitter";
import { ControllerData } from "./controller.js";
import { MotorEvent } from "./motor.js";
import { Vector } from "vector";

export type Events = {
	controllerData(data: ControllerData): void;
	motorData(data: MotorEvent): void;
	simulationAccelerationData(data: Vector): void;
	simulationGyroData(data: [timestamp: number, vector: Vector]): void;
};

export const emitter = new TypedEmitter<Events>();
