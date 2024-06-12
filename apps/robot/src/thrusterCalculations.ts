import * as math from 'mathjs';
import { Thruster, thrusters } from './thruster.js';
import * as vector from 'vector';

export interface ThrusterMovement {
	type: Thruster;
	speed: number;
}

export interface MoveOutput {
	thrusters: ThrusterMovement[];
	resultingForce: vector.Vector;
	resultingTorque: vector.Vector;
	directionDifference: vector.Vector;
	torqueDifference: vector.Vector;
}

export function calculateForce(thrusterMovement: ThrusterMovement[]): vector.Vector {
	return thrusterMovement.reduce(
		(force, movement) => {
			const thruster = thrusters.find((thruster) => thruster.type === movement.type);
			if (!thruster) {
				return force;
			}
			return vector.add(force)(vector.scale(thruster.thrustDirection)(movement.speed));
		},
		vector.vector(0, 0, 0)
	);
}

export function calculateTorque(thrusterMovement: ThrusterMovement[]): vector.Vector {
	return thrusterMovement.reduce(
		(torque, movement) => {
			const thruster = thrusters.find((t) => t.type === movement.type);
			if (!thruster) {
				return torque;
			}
			return vector.add(torque)(
				vector.cross(thruster.position)(vector.scale(thruster.thrustDirection)(movement.speed))
			);
		},
		vector.vector(0, 0, 0)
	);
}

function calculateControlMatrix() {
	// Our control matrix
	let controlMatrix = math.zeros([6, 6]);

	const rovCenterOfMass = vector.vector(0, 0, 0);

	const thrusterValues = Object.values(thrusters);

	// Populate the first three rows with force contributions
	for (let i = 0; i < 6; i++) {
		const orientation = math.matrix(vector.asTuple(thrusterValues[i].thrustDirection));
		controlMatrix = math.subset(
			controlMatrix,
			math.index(math.range(0, 3), i),
			math.reshape(orientation, [3, 1])
		);
	}

	// Populate the last three rows with torque contributions
	for (let i = 0; i < 6; i++) {
		const location = thrusterValues[i].position;
		const orientation = math.matrix(vector.asTuple(thrusterValues[i].thrustDirection));
		const displacement = math.matrix(vector.asTuple(vector.subtract(location)(rovCenterOfMass)));
		// using cross product here to account for the extra rotation produced from
		// the thrusters
		const torque = math.reshape(math.cross(displacement, orientation), [3, 1]);
		controlMatrix = math.subset(controlMatrix, math.index(math.range(3, 6), i), torque);
	}

	return controlMatrix;
}

function calculateControlMatrixInverse() {
	// Calculate the inverse of the control matrix, so we can map the thrusters to force and torque,
	// instead of the other way around.
	return math.inv(calculateControlMatrix());
}

export const controlMatrix = Object.freeze(calculateControlMatrix());
export const controlInverse = Object.freeze(calculateControlMatrixInverse());

function convertToThrusterPowers(force: vector.VectorTuple, torque: vector.VectorTuple) {
	const inputVector = math.transpose(math.matrix([...force, ...torque]));
	return math.multiply(controlInverse as math.MathCollection, inputVector);
}

/**
 * Gives the optimal configuration
 * to direct the robot in the given direction.
 *
 * @param direction The desired direction.
 * @param torque The desired torque.
 *
 * Where direction and torque are limited to the [+-1, +-1, +-1] vector space range
 *
 * @returns The optimal configuration. Difference variables are provided if deviations are needed.
 * This function will compromise evenly between direction and torque, getting the smallest difference on both.
 */
export function move(direction: vector.Vector, torque: vector.Vector): MoveOutput {
	// Convert the combined vector to thruster powers using the control matrix inverse
	const thrusterPowers = convertToThrusterPowers(vector.asTuple(direction), vector.asTuple(torque));

	// Map the thruster powers to the corresponding thruster types
	const thrusterMovement = [
		{ type: Thruster.BottomLeft, speed: thrusterPowers.get([0]) },
		{ type: Thruster.BottomRight, speed: thrusterPowers.get([1]) },
		{ type: Thruster.TopLeft, speed: thrusterPowers.get([2]) },
		{ type: Thruster.TopRight, speed: thrusterPowers.get([3]) },
		{ type: Thruster.VerticalLeft, speed: thrusterPowers.get([4]) },
		{ type: Thruster.VerticalRight, speed: thrusterPowers.get([5]) }
	];

	// Calculate the resulting force and torque for the given thruster speeds
	const resultingForce = calculateForce(thrusterMovement);
	const resultingTorque = calculateTorque(thrusterMovement);

	// Compute the differences between the desired and resulting force and torque
	const directionDifference = vector.subtract(direction)(resultingForce);
	const torqueDifference = vector.subtract(torque)(resultingTorque);

	return {
		thrusters: thrusterMovement,
		resultingForce,
		resultingTorque,
		directionDifference,
		torqueDifference
	};
}

/** Converts speed to servo, where speed is constrained to [-1, 1] */
export function speedToServo(speed: number) {
	// 1100 - 1900, 1500 is neutral
	const min = 1100;
	const max = 1900;
	return Math.round(speed * ((max - min) / 2) + (max + min) / 2);
}
