/**
 * General X and Y position interface
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
	view: number;
	throttle: number;
	buttons: {
		trigger: boolean;
		side_grip: boolean;
		side_panel: {
			bottom_left: boolean,
			top_left: boolean,
			bottom_middle: boolean,
			top_middle: boolean,
			bottom_right: boolean,
			top_right: boolean,
		};
		controller_buttons: {
			top_left: boolean;
			top_right: boolean;
			bottom_left: boolean;
			bottom_right: boolean;
		};
	};
}

export interface ServerToClientsMap {
	controllerData: (data: ControllerData) => void;
}

export interface ClientToServerMap {
	mixedControllerData: (data: Partial<ControllerData>) => void;
}

export const defaultControllerData: ControllerData = Object.freeze({
	position: {
		x: 50,
		y: 50
	},
	yaw: 0,
	view: 0,
	throttle: 0,
	buttons: {
		trigger: false,
		side_grip: false,
		side_panel: {
			bottom_left: false,
			top_left: false,
			bottom_middle: false,
			top_middle: false,
			bottom_right: false,
			top_right: false
		},
		controller_buttons: {
			top_left: false,
			top_right: false,
			bottom_left: false,
			bottom_right: false
		}
	}
});