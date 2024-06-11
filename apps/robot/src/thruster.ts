import memoize from 'memoize';
import * as vector from 'vector';

/**
 * The thrusters on the robot.
 *
 * Note: When saying "left" and "right", that refers to
 * the left and right side of the front view of the robot.
 */
export enum Thruster {
	/** Angled thruster on the left side of the bottom of the robot */
	BottomLeft = "BOTTOM_LEFT",
	/** Angled thruster on the right side of the bottom of the robot */
	BottomRight = "BOTTOM_RIGHT",
	/** Angled thruster on the left side of the top of the robot */
	TopLeft = "TOP_LEFT",
	/** Angled thruster on the right side of the top of the robot */
	TopRight = "TOP_RIGHT",
	/** Thruster on the left that moves the robot up and down */
	VerticalLeft = "VERTICAL_LEFT",
	/** Thruster on the right that moves the robot up and down */
	VerticalRight = "VERTICAL_RIGHT"
}

export interface ThrusterEvent {
	/** The thruster to move */
	thruster: Thruster;
	/** The speed to move the thruster at, between -1 and 1 */
	speed: number;
}

export interface ThrusterConstraint {
	type: Thruster;
	position: vector.Vector;
	thrustDirection: vector.Vector;
	gpioPin: number;
}

// measured manually via fusion :}
export const thrusters: ThrusterConstraint[] = [
	{
		type: Thruster.BottomLeft,
		position: vector.vector(119.28 / 1000, -18.314 / 1000, -95.233 / 1000),
		thrustDirection: vector.normalize(vector.vector(1, 0, Math.sqrt(3))),
		gpioPin: 5
	},
	{
		type: Thruster.BottomRight,
		position: vector.vector(-119.28 / 1000, -18.314 / 1000, -95.233 / 1000),
		thrustDirection: vector.normalize(vector.vector(-1, 0, Math.sqrt(3))),
		gpioPin: 6
	},
	{
		type: Thruster.TopLeft,
		position: vector.vector(112.299 / 1000, 41.738 / 1000, 105.808 / 1000),
		thrustDirection: vector.normalize(vector.vector(-1, 0, Math.sqrt(3))),
		gpioPin: 13
	},
	{
		type: Thruster.TopRight,
		position: vector.vector(-112.299 / 1000, 41.738 / 1000, 105.808 / 1000),
		thrustDirection: vector.normalize(vector.vector(1, 0, Math.sqrt(3))),
		gpioPin: 16
	},
	{
		type: Thruster.VerticalLeft,
		position: vector.vector(119.862 / 1000, -66.776 / 1000, 2.231 / 1000),
		thrustDirection: vector.normalize(vector.vector(0, -1, 0)),
		gpioPin: 19
	},
	{
		type: Thruster.VerticalRight,
		position: vector.vector(-119.862 / 1000, -66.776 / 1000, 2.231 / 1000),
		thrustDirection: vector.normalize(vector.vector(0, -1, 0)),
		gpioPin: 12
	}
];

export const getThruster = memoize((type: Thruster): ThrusterConstraint => thrusters.find(thruster => thruster.type == type)!);
