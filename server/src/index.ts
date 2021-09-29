import Fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifySocketIo from 'fastify-socket.io'
import path from "path"
import * as HID from "node-hid";
import { logger } from "./logger"

let device: HID.HID | undefined = undefined

const controllerListen = () => {
	try {
		device = new HID.HID(1133, 49685); // Logitech Pro 3D controller vendor/product ID

		device.on("data", function(data) {
			console.log(data) // TODO use socket.io to send data to client
		});
	} catch (e) {

		if (!(e instanceof Error)) return;

		if (e.message.includes("cannot open device")) {
			logger.warn(e.message);
		} else {
			// device not found / unable to connect
			logger.warn("Controller not found; manual override necessary")
		}
		device = undefined
	}
}

controllerListen()

const app = Fastify({});
const port = 3000;

app.register(fastifyStatic, {
	root: path.join(__dirname, '..', '..', 'client', 'public')
})

app.register(fastifySocketIo)

app.ready(err => {
	if (err) throw err

	app.io.on("connect", (socket) => {
		if (device !== undefined)
			socket.emit("controllerAvailable")
	})

	app.io.on("position", position => {
		console.log(position)
	})
})

const start = async () => {
	await app.listen(port);

	logger.info(`Listening to https://localhost:${port}`);
}

start()