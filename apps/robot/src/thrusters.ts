import * as math from 'mathjs';
import { Motor } from './motor.js';
import * as vector from 'vector';

export interface MotorConstraint {
	type: Motor;
	position: vector.Vector;
	thrustDirection: vector.Vector;
}

const t200_12v_max_newtons = 32.5;
const thrustOffset = -30;

// measured manually via fusion :}
export const thrusters: MotorConstraint[] = [
	{
		type: Motor.BottomLeft,
		position: vector.vector(119.28 / 1000, -18.314 / 1000, -95.233 / 1000),
		thrustDirection: vector.normalize(vector.vector(1, 0, Math.sqrt(3)))
	},
	{
		type: Motor.BottomRight,
		position: vector.vector(-119.28 / 1000, -18.314 / 1000, -95.233 / 1000),
		thrustDirection: vector.normalize(vector.vector(-1, 0, Math.sqrt(3)))
	},
	{
		type: Motor.TopLeft,
		position: vector.vector(112.299 / 1000, 41.738 / 1000, 105.808 / 1000),
		thrustDirection: vector.normalize(vector.vector(-1, 0, Math.sqrt(3)))
	},
	{
		type: Motor.TopRight,
		position: vector.vector(-112.299 / 1000, 41.738 / 1000, 105.808 / 1000),
		thrustDirection: vector.normalize(vector.vector(1, 0, Math.sqrt(3)))
	},
	{
		type: Motor.VerticalLeft,
		position: vector.vector(119.862 / 1000, -66.776 / 1000, 2.231 / 1000),
		thrustDirection: vector.normalize(vector.vector(0, -1, 0))
	},
	{
		type: Motor.VerticalRight,
		position: vector.vector(-119.862 / 1000, -66.776 / 1000, 2.231 / 1000),
		thrustDirection: vector.normalize(vector.vector(0, -1, 0))
	}
];

export const getThruster = (type: Motor): MotorConstraint => thrusters.find(thruster => thruster.type == type)!

export interface MotorMovement {
	type: Motor;
	speed: number;
}

export interface MoveOutput {
	motors: MotorMovement[];
	resultingForce: vector.Vector;
	resultingTorque: vector.Vector;
	directionDifference: vector.Vector;
	torqueDifference: vector.Vector;
}

function calculateForce(motorMovement: MotorMovement[]): vector.Vector {
	return motorMovement.reduce(
		(force, movement) => {
			const motor = thrusters.find(thruster => thruster.type === movement.type);
			if (!motor) {
				return force;
			}
			return vector.add(force)(vector.scale(motor.thrustDirection)(movement.speed));
		},
		vector.vector(0, 0, 0)
	);
}

function calculateTorque(motorMovement: MotorMovement[]): vector.Vector {
	return motorMovement.reduce(
		(torque, movement) => {
			const motor = thrusters.find((t) => t.type === movement.type);
			if (!motor) {
				return torque;
			}
			return vector.add(torque)(
				vector.cross(motor.position)(vector.scale(motor.thrustDirection)(movement.speed))
			);
		},
		vector.vector(0, 0, 0)
	);
}

function calculateInverse() {
	// Our control matrix
	let controlMatrix = math.zeros([6, 6]);

	const rovCenterOfMass = [0, 0, 0];

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
		const location = vector.asTuple(thrusterValues[i].position);
		const orientation = vector.asTuple(thrusterValues[i].thrustDirection);
		const displacement = math.subtract(location, rovCenterOfMass);
		// using cross product here to account for the extra rotation produced from
		// the motors
		const torque = math.reshape(math.transpose(math.cross(displacement, orientation)), [3, 1]);
		controlMatrix = math.subset(controlMatrix, math.index(math.range(3, 6), i), torque);
	}

	// Calculate the inverse of the control matrix, so we can map the motors to force and torque,
	// instead of the other way around.
	return math.inv(controlMatrix);
}

export const controlInverse = Object.freeze(calculateInverse());

function convertToMotorPowers(force: vector.VectorTuple, torque: vector.VectorTuple) {
	const inputVector = math.transpose(math.matrix([...force, ...torque]));
	const motorPowers = math.multiply(controlInverse as math.MathCollection, inputVector);
	return motorPowers;
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
	// Convert the combined vector to motor powers using the control matrix inverse
	const motorPowers = convertToMotorPowers(vector.asTuple(direction), vector.asTuple(torque));

	// Map the motor powers to the corresponding thruster types
	const motorMovement = [
		{ type: Motor.BottomLeft, speed: motorPowers.get([0]) },
		{ type: Motor.BottomRight, speed: motorPowers.get([1]) },
		{ type: Motor.TopLeft, speed: motorPowers.get([2]) },
		{ type: Motor.TopRight, speed: motorPowers.get([3]) },
		{ type: Motor.VerticalLeft, speed: motorPowers.get([4]) },
		{ type: Motor.VerticalRight, speed: motorPowers.get([5]) }
	];

	// Calculate the resulting force and torque for the given motor speeds
	const resultingForce = calculateForce(motorMovement);
	const resultingTorque = calculateTorque(motorMovement);

	// Compute the differences between the desired and resulting force and torque
	const directionDifference = vector.subtract(direction)(resultingForce);
	const torqueDifference = vector.subtract(torque)(resultingTorque);

	return {
		motors: motorMovement,
		resultingForce,
		resultingTorque,
		directionDifference,
		torqueDifference
	};
}
