/**
 * The motors on the robot.
 *
 * Note: When saying "left" and "right", that refers to
 * the left and right side of the front view of the robot.
 */
export enum Motor {
	/** Angled motor on the left side of the bottom of the robot */
	BottomLeft = "BOTTOM_LEFT",
	/** Angled motor on the right side of the bottom of the robot */
	BottomRight = "BOTTOM_RIGHT",
	/** Angled motor on the left side of the top of the robot */
	TopLeft = "TOP_LEFT",
	/** Angled motor on the right side of the top of the robot */
	TopRight = "TOP_RIGHT",
	/** Motor on the left that moves the robot up and down */
	VerticalLeft = "VERTICAL_LEFT",
	/** Motor on the right that moves the robot up and down */
	VerticalRight = "VERTICAL_RIGHT"
}

export interface MotorEvent {
	/** The motor to move */
	motor: Motor;
	/** The speed to move the motor at, between -1 and 1 */
	speed: number;
}
