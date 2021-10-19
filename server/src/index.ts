import * as HID from "node-hid";
import { logger } from "./logger"
import { start } from './web'

const grabController = (): HID.HID | undefined => {
	try {
		return new HID.HID(1133, 49685); // Logitech Pro 3D controller vendor/product ID
	} catch (e) {

		// Typescript Type Check
		if (!(e instanceof Error)) return undefined;

		if (e.message.includes("cannot open device")) {
			// device is plugged in but can't connect to
			logger.warn(e.message);
		} else {
			// device not found / unable to connect
			logger.warn("Controller not found; manual override necessary")
		}

		// either way, no device found
		return undefined
	}
}

const device = grabController()

start(device)