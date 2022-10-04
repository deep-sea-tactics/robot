import flyd from 'flyd';

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
/**
 * Reactive stream for data
 */

//if it works don't ask
export const controllerData = flyd.stream<ControllerData>({ ...defaultControllerData });
export const mixedControllerData = flyd.stream<Partial<ControllerData>>({ ...defaultControllerData });
export const finalControllerData = flyd.combine((controllerData, mixedControllerData) => {
	return({...controllerData(), ...mixedControllerData()}); 
}, [controllerData, mixedControllerData]);

//Tristan is killing me slowly :/

