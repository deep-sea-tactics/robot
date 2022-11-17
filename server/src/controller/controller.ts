// Adapted and modernized from https://github.com/poweic/node-Logitech-Extreme-3D-Pro/blob/master/app.js

import type { ControllerData } from 'landstown-robotics-types';

/**
 * If the num is 0, return false, else return true
 *
 * Logic: `num !== 0`
 *
 * @param num The number to check against
 * @returns if the num is 0, return false, else return true
 */
const bool = (num: number) => num !== 0;

/**
 * Turns a raw Buffer from the controller to parsed ControllerData
 * @param data The raw Buffer from the controller
 * @returns Parsed ControllerData
 */
export const rawDataToControllerData = (data: Buffer): ControllerData | undefined => {
	// If the hex data does not have 1-2 characters, it is not good.
	const rawDataMatches = data.toString('hex').match(/..?/g);

	if (rawDataMatches == null) return;

	const parsedRawData = rawDataMatches.map(item => parseInt(item, 16));

	return {
		position: {
			x: (((parsedRawData[1] & 0x03) << 8) + parsedRawData[0]) / 10.24,
			y: (((parsedRawData[2] & 0x0f) << 6) + ((parsedRawData[1] & 0xfc) >> 2)) / 10.24,
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
				top_right: bool((parsedRawData[4] & 0x20) >> 5),
			},
			side_panel: {
				bottom_left: bool((parsedRawData[4] & 0x40) >> 6),
				top_left: bool((parsedRawData[4] & 0x80) >> 7),
				bottom_middle: bool((parsedRawData[6] & 0x01) >> 0),
				top_middle: bool((parsedRawData[6] & 0x02) >> 1),
				bottom_right: bool((parsedRawData[6] & 0x04) >> 2),
				top_right: bool((parsedRawData[6] & 0x08) >> 3),
			},
		},
	};
};
