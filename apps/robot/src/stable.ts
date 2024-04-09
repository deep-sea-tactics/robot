import * as vector from 'vector';
import { emitter } from './emitter.js';

let currentRotation = vector.vector(0, 0, 0);

emitter.on('simulationGyroData', ([time, angularVelocity]) => {
	currentRotation = vector.add(currentRotation)(vector.scale(angularVelocity)(time));
});

export function calculateNeededTorque(): vector.Vector {
	return vector.vector(0, 0, 0);
}