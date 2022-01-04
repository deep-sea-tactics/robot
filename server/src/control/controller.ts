// Adapted and modernized from https://github.com/poweic/node-Logitech-Extreme-3D-Pro/blob/master/app.js

import type { Server } from 'socket.io'
import { ControllerData } from './position'


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
		position: {
			x: (((parsedRawData[1] & 0x03) << 8) + parsedRawData[0]) / 10.24,
			y: ((parsedRawData[2] & 0x0f) << 6) + ((parsedRawData[1] & 0xfc) >> 2) / 10.24,
		},
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
 * Sends formatted data from a raw buffer to a socket
 * @param socket The socket to use.
 * @param data The data to process and send to the socket.
 */
export const sendDataToSocket = (socket: Server, data: Buffer): ControllerData | undefined => {
	const parsedData = rawDataToControllerData(data);
	
	if (parsedData === undefined) {
		return parsedData
	}

	socket.emit("controllerData", parsedData)

	return parsedData
}