export enum Motor {
	/** Motor on the left that moves the robot side to side */
	SideFront,
	/** Motor on the right that moves the robot side to side */
	SideBack,
	/** Motor on the left that moves the robot forward and backward */
	FrontLeft,
	/** Motor on the right that moves the robot forward and backward */
	FrontRight,
	/** Motor on the left that moves the robot up and down */
	TopLeft,
	/** Motor on the right that moves the robot up and down */
	TopRight
}

export interface MotorEvent {
	/** The motor to move */
	motor: Motor;
	/** The speed to move the motor at, between -1 and 1 */
	speed: number;
}
