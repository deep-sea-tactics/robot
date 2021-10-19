// Adapted and modernized from https://github.com/poweic/node-Logitech-Extreme-3D-Pro/blob/master/app.js

import type { Server } from 'socket.io'
import { Position } from './position'

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
interface ControllerData {
	roll: number;
	pitch: number;
	yaw: number;
	view: number;
	throttle: number;
	buttons: ButtonMapping;
}

/**
 * If num is 0, return false, else return true
 * @param num The number to check against
 * @returns if the num is 0, return false, else return true
 */
const bool = (num: number) => num !== 0;

const rawDataToControllerData = (data: Buffer): ControllerData | undefined => {

	const rawDataMatches = data.toString('hex').match(/.{1,2}/g)

	if (rawDataMatches == null) return;

	const parsedRawData = rawDataMatches.map((item) => parseInt(item, 16));

	return {	
		roll: ((parsedRawData[1] & 0x03) << 8) + parsedRawData[0],
		pitch: ((parsedRawData[2] & 0x0f) << 6) + ((parsedRawData[1] & 0xfc) >> 2),
		yaw: parsedRawData[3],
		view: (parsedRawData[2] & 0xf0) >> 4,
		throttle: -parsedRawData[5] + 255,
		buttons: {
			trigger: bool((parsedRawData[4] & 0x01) >> 0),
			side_grip: bool((parsedRawData[4] & 0x02) >> 1),
			controller_buttons: {
				bottom_left: bool((parsedRawData[4] & 0x04) >> 2),
				bottom_right: bool((parsedRawData[4] & 0x08) >> 3),
				top_left: bool((parsedRawData[4] & 0x10) >> 4),
				top_right: bool((parsedRawData[4] & 0x20) >> 5)
			},
			side_panel: {
				top_left: bool((parsedRawData[4] & 0x40) >> 6),
				top_right: bool((parsedRawData[4] & 0x80) >> 7),
				middle_left: bool((parsedRawData[6] & 0x01) >> 0),
				middle_right: bool((parsedRawData[6] & 0x02) >> 1),
				bottom_left: bool((parsedRawData[6] & 0x04) >> 2),
				bottom_right: bool((parsedRawData[6] & 0x08) >> 3)
			}
		}
	};
}

/**
 * Turns [ControllerData] into a Position
 * @param data 
 * @returns A position, each value ranges from 0-100
 */
export const controllerDataToPosition = (data: ControllerData): Position => {
	return {
		x: data.roll / 10.24,
		y: data.pitch / 10.24
	}
}

/**
 * Sends formatted data from a raw buffer to a socket
 * @param socket The socket to use.
 * @param data The data to process and send to the socket.
 */
export const sendDataToSocket = (socket: Server, data: Buffer): ControllerData | undefined => {
	const parsedData = rawDataToControllerData(data);
	
	if (parsedData === undefined) {
		return parsedData
	}

	socket.emit("controllerData", {
		position: controllerDataToPosition(parsedData),
		triggerEnabled: parsedData.buttons.trigger
	})

	return parsedData
}