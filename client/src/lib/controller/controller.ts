import { writable } from "svelte/store";
import type { Position } from './typings';
import { client } from '../socket/socket'

interface ControllerData {
	position: Position,
	yaw: number,
	view: number,
	throttle: number,
	buttons: {
		trigger: boolean,
		side_grip: boolean,
		controller_buttons: {
			bottom_left: boolean,
			bottom_right: boolean,
			top_left: boolean,
			top_right: boolean
		},
		side_panel: {
			top_left: boolean,
			top_right: boolean,
			middle_left: boolean,
			middle_right: boolean,
			bottom_left: boolean,
			bottom_right: boolean
		}
	}
}

/* A position from 0-100 on two axises, where 0 is the top left and 100 is the bottom right. */
export const data = writable<ControllerData>();
export const forward = writable(false);

forward.subscribe(change => client.emit("forward", change))

client.on("controllerData", ($data: ControllerData) => {
	data.set($data)
})