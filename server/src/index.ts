import Fastify from "fastify"
import fastifyStatic from "fastify-static"
import path from "path"
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
		console.log(data) // TODO use socket.io to send data to client
	});
} catch (e) {
	logger.warn("Controller not found; manual override necessary")
	// device not found
}

const app = Fastify({});
const port = 3000;

app.register(fastifyStatic, {
	root: path.join(__dirname, '..', '..', 'client', 'public')
})

const start = async () => {
	await app.listen(port);

	logger.info(`Listening to https://localhost:${port}`);
}

start()