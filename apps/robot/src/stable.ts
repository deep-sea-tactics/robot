import * as vector from 'vector';
import z from "zod"
import { move } from './thrusters.js';
import { Motor } from './motor.js';
import { emitter } from './emitter.js';

let targetRotation = vector.vector(0, 0, 0)
let currentRotation = vector.vector(0, 0, 0)



const fakeVector = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number()
});

export const setTargetRotation = (target: z.infer<typeof fakeVector>) => {
    targetRotation = target;
}

export const setCurrentRotation = (current: z.infer<typeof fakeVector>) => {
    currentRotation = current;
}

export const createAlignment = () => {
    setInterval(alignmentStep, 1000)
    
    
    //calculate amount of thrust needed on 
}

const alignmentStep = () => {
    const rotationDifference = vector.vector(currentRotation.x - targetRotation.x, currentRotation.y - targetRotation.y, currentRotation.z - targetRotation.z);
	const thrust = vector.vector(0.1 * -rotationDifference.x, 0.1 * -rotationDifference.y, 0.1 * -rotationDifference.z);
	console.log(thrust)
    const movement = move(
		vector.vector(0, 0, 0),
		thrust
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
}