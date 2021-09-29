import express from "express";
import cors from "cors";
import * as HID from "node-hid";
import { logger } from "./logger"

function findController(): HID.HID | undefined {
	const foundDevices = HID.devices().filter(item => item.product == "Logitech Extreme 3D");

	if (foundDevices.length === 0) return undefined

	return new HID.HID(foundDevices[0].path as string);
}

try {
	const device = findController() as HID.HID;

	device.on("data", function(data) {
		console.log(data)
	});
} catch (e) {
	logger.warn("Controller not found; manual override necessary")
	// device not found
}

const app = express();
const port = 3000;

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => logger.info("Listening on port " + port));