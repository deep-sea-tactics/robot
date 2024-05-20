import * as vector from 'vector';
import { emitter } from './emitter.js';
import type { ControllerData } from './controller.js';

let currentRotation = vector.vector(0, 0, 0);

emitter.on('simulationGyroData', ([time, angularVelocity]) => {
	currentRotation = vector.add(currentRotation)(vector.scale(angularVelocity)(time));
});

type Rotation = ControllerData['rotation'];

export function calculateNeededTorque(rotation: Rotation): vector.Vector {
	return vector.vector(rotation.yaw, rotation.pitch, 0);
}
