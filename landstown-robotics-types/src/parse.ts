import type { ControllerData } from './typings';

const bool = (num: number) => num !== 0;

export function buf2hex(buffer: ArrayBuffer) {
	return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function processData(view: DataView): ControllerData {
	const rawData = buf2hex(view.buffer).match(/..?/g);
	if (rawData == null) throw Error('No data?');
	const parsedRawData = rawData.map(item => parseInt(item, 16));
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
}
