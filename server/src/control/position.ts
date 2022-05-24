import { stream } from 'flyd'

/**
 * General X and Y position interface
 */
export interface Position {
	x: number;
	y: number;
}


/**
 * All the buttons on the Logitech 3D Pro Controller
 */
 interface ButtonMapping {
	trigger: boolean;
	side_grip: boolean;
	side_panel: SidePanel;
	controller_buttons: ControllerButtons;
}

/**
 * The panel on the left of the controller
 */
interface SidePanel {
	top_left: boolean;
	top_right: boolean;
	middle_left: boolean;
	middle_right: boolean;
	bottom_left: boolean;
	bottom_right: boolean;
}

/**
 * The buttons on the top of the joystic
 */
interface ControllerButtons {
	top_left: boolean;
	top_right: boolean;
	bottom_left: boolean;
	bottom_right: boolean;
}

/**
 * All data sent from the controller
 */
export interface ControllerData {
	position: Position,
	yaw: number;
	view: number;
	throttle: number;
	buttons: ButtonMapping;
}

export const controllerInUse = stream<Boolean>(true)
export const forward = stream<Boolean>(false)

/**
 * Reactive stream for data
 */
export const controllerData = stream<ControllerData>({
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
			top_left: false,
			top_right: false,
			middle_left: false,
			middle_right: false,
			bottom_left: false,
			bottom_right: false
		},
		controller_buttons: {
			top_left: false,
			top_right: false,
			bottom_left: false,
			bottom_right: false
		}
	}
});