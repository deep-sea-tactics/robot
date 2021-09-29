// Adapted and modernized from https://github.com/poweic/node-Logitech-Extreme-3D-Pro/blob/master/app.js

import type { Server } from 'socket.io'
import * as HID from "node-hid";

const rawDataToControllerData = (data: Buffer) => {

	const rawDataMatches = data.toString('hex').match(/.{1,2}/g)

	if (rawDataMatches == null) return;

	const parsedRawData = rawDataMatches.map((item) => parseInt(item, 16));

	return {	
		roll: ((parsedRawData[1] & 0x03) << 8) + parsedRawData[0],
		pitch: ((parsedRawData[2] & 0x0f) << 6) + ((parsedRawData[1] & 0xfc) >> 2),
		yaw: parsedRawData[3],
		view: (parsedRawData[2] & 0xf0) >> 4,
		throttle: -parsedRawData[5] + 255,
		buttons: [
			(parsedRawData[4] & 0x01) >> 0,
			(parsedRawData[4] & 0x02) >> 1,
			(parsedRawData[4] & 0x04) >> 2,
			(parsedRawData[4] & 0x08) >> 3,
			(parsedRawData[4] & 0x10) >> 4,
			(parsedRawData[4] & 0x20) >> 5,
			(parsedRawData[4] & 0x40) >> 6,
			(parsedRawData[4] & 0x80) >> 7,

			(parsedRawData[6] & 0x01) >> 0,
			(parsedRawData[6] & 0x02) >> 1,
			(parsedRawData[6] & 0x04) >> 2,
			(parsedRawData[6] & 0x08) >> 3
		]
	};
}

export const listenToLogitechController = (socket: Server, device: HID.HID): void => {
	device.on("data", data => {
		const parsedData = rawDataToControllerData(data);
		
		console.log(parsedData)
	})
}