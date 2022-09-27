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
			top_left: boolean;
			top_right: boolean;
			middle_left: boolean;
			middle_right: boolean;
			bottom_left: boolean;
			bottom_right: boolean;
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
