import { TypedEmitter } from "tiny-typed-emitter";
import { ControllerData } from "./controller.js";
import { MotorEvent } from "./motor.js";
import { AccelerationData, GyroData } from "./sensors.js";

export type Events = {
	controllerData: (data: ControllerData) => void;
	motorData: (data: MotorEvent) => void;
	simulationAccelerationData: (data: AccelerationData) => void;
	simulationGyroData: (data: GyroData) => void;
};

export const emitter = new TypedEmitter<Events>();