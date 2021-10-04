// Adapted and modernized from https://github.com/poweic/node-Logitech-Extreme-3D-Pro/blob/master/app.js

import type { Server } from 'socket.io'
import * as HID from "node-hid";

interface ButtonMapping {
	trigger: boolean;
	side_grip: boolean;
	side_panel: SidePanel;
	controller_buttons: ControllerButtons;
}

interface SidePanel {
	top_left: boolean;
	top_right: boolean;
	middle_left: boolean;
	middle_right: boolean;
	bottom_left: boolean;
	bottom_right: boolean;
}

interface ControllerButtons {
	top_left: boolean;
	top_right: boolean;
	bottom_left: boolean;
	bottom_right: boolean;
}

interface ControllerData {
	roll: number;
	pitch: number;
	yaw: number;
	view: number;
	throttle: number;
	buttons: ButtonMapping;
}

const bool = (num: number) => num === 0 ? false : true;

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

interface Position {
	x: number;
	y: number;
}

// TODO reuse TS
const controllerDataToPosition = (data: ControllerData): Position => {
	return {
		x: data.roll / 10.24,
		y: data.pitch / 10.24
	}
}

export const listenToLogitechController = (socket: Server, device: HID.HID): void => {
	device.on("data", data => {
		const parsedData = rawDataToControllerData(data);
		
		if (parsedData === undefined) {
			return
		}

		socket.emit("controllerData", {
			position: controllerDataToPosition(parsedData),
			triggerEnabled: parsedData.buttons.trigger
		})
	})
}