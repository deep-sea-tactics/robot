import { logger } from '../logger'
import * as HID from "node-hid";
import flyd, { stream } from 'flyd'

/**
 * Grabs a file from the running computer
 * @returns A HID device
 */
 const grabController = (log = true): HID.HID | undefined => {
	try {
		return new HID.HID(1133, 49685); // Logitech Pro 3D controller vendor/product ID
	} catch (e) {

		// Typescript Type Check
		if (!(e instanceof Error)) return undefined;

        if (!log) return undefined;

		if (e.message.includes("cannot open device")) {
			// device is plugged in but can't connect to
			logger.warn(e.message + " (Logitech Pro 3D controller)");
		} else {
			// device not found / unable to connect
			logger.warn("Controller not found; manual override necessary")
		}

		// either way, no device found
		return undefined
	}
}

export const device = stream(grabController())

let interval: NodeJS.Timeout | undefined = undefined

flyd.on(change => {

    if (change !== undefined && interval !== undefined) {
        clearInterval(interval);
        interval = undefined;
        logger.info("Logitech device reconnected")
        return
    }

    if (change !== undefined) return

    interval = setInterval(() => {
        const controller = grabController(false)

        if (controller != undefined) device(controller)
    }, 1000)
}, device)