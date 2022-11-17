import consola from 'consola';
import flyd from 'flyd';
import { HID } from 'node-hid';

/**
 * Grabs a file from the running computer
 * @returns A HID device
 */
const grabController = (log = true): HID | undefined => {
	try {
		return new HID(1133, 49685); // Logitech Pro 3D controller vendor/product ID
	} catch (e) {
		// Typescript Type Check
		if (!(e instanceof Error)) return undefined;

		// We don't need to log anything to the console.
		if (!log) return undefined;

		if (e.message.includes('cannot open device')) {
			// device is plugged in but can't connect to
			consola.warn(e.message + ' (Logitech Pro 3D controller)');
		} else {
			// device not found / unable to connect
			consola.warn('Logitech controller not found: ' + e.message);
		}

		// either way, no device found
		return undefined;
	}
};

export const device = flyd.stream(grabController());

let interval: NodeJS.Timeout | undefined = undefined;

flyd.on(newDevice => {
	// We found the device (and the interval is still active) -- let the server know
	if (newDevice !== undefined && interval !== undefined) {
		clearInterval(interval);
		interval = undefined;
		consola.info('Logitech controller reconnected');
		return;
	}

	// We already found the device a bit ago
	if (newDevice !== undefined) return;

	interval = setInterval(() => {
		// Attempt to get the controller via HID
		const controller = grabController(false);

		// We found the controler -- put it in
		if (controller != undefined) device(controller);
	}, 1000);
}, device);
