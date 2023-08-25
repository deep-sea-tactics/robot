import { writable } from 'svelte/store';
import type { ControllerData } from './typings';

/* A position from 0-100 on two axises, where 0 is the top left and 100 is the bottom right. */
export const data = writable<ControllerData | undefined>(undefined);

export const controllerConnected = writable<boolean>(false);

window.addEventListener('gamepadconnected', (e) => {
	if (e.gamepad.id.includes('Logitech Extreme 3D')) controllerConnected.set(true);
});

window.addEventListener('gamepaddisconnected', (e) => {
	if (e.gamepad.id.includes('Logitech Extreme 3D')) controllerConnected.set(false);
});

function grabController() {
	const gamepads = navigator.getGamepads();

	for (const gamepad of gamepads) {
		if (!gamepad) continue;
		if (!gamepad.id.includes('Logitech Extreme 3D')) return;
		const buttons = gamepad.buttons.map(button => button.pressed);
		const axis = gamepad.axes;
		data.set({
			position: {
				x: axis[0] * 50 + 50,
				y: axis[1] * 50 + 50,
			},
			yaw: axis[2],
			view: {
				x: axis[4],
				y: axis[5],
			},
			throttle: axis[3],
			buttons: {
				trigger: buttons[0],
				side_grip: buttons[1],
				side_panel: {
					bottom_left: buttons[6],
					top_left: buttons[7],
					bottom_middle: buttons[8],
					top_middle: buttons[9],
					bottom_right: buttons[10],
					top_right: buttons[11],
				},
				controller_buttons: {
					top_left: buttons[4],
					bottom_left: buttons[2],
					top_right: buttons[5],
					bottom_right: buttons[3],
				},
			},
		});
	}

	requestAnimationFrame(grabController);
}

requestAnimationFrame(grabController);
