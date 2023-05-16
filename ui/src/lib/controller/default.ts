import type { ControllerData } from './typings';

export const defaultControllerData: ControllerData = Object.freeze({
	position: {
		x: 50,
		y: 50,
	},
	yaw: 0,
	view: {
		x: 0,
		y: 0,
	},
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
			top_right: false,
		},
		controller_buttons: {
			top_left: false,
			top_right: false,
			bottom_left: false,
			bottom_right: false,
		},
	},
});
