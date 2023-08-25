/**
 * General X and Y position interface.
 *
 * X and Y are between 0-100. 50 is in the middle.
 *
 * 0y means backwards, 100y means forwards
 * 0x means left, 100x means right
 */
export interface Position {
	x: number;
	y: number;
}

/**
 * All data sent from the controller
 */
export interface ControllerData {
	position: Position;
	yaw: number;
	view: Position;
	throttle: number;
	buttons: {
		trigger: boolean;
		side_grip: boolean;
		side_panel: {
			bottom_left: boolean;
			top_left: boolean;
			bottom_middle: boolean;
			top_middle: boolean;
			bottom_right: boolean;
			top_right: boolean;
		};
		controller_buttons: {
			top_left: boolean;
			top_right: boolean;
			bottom_left: boolean;
			bottom_right: boolean;
		};
	};
}
