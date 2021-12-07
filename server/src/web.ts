import Fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifySocketIo from 'fastify-socket.io'
import path from "path"
import { sendDataToSocket, controllerDataToPosition } from './control/controller';
import { logger } from "./logger"
import { position } from './control/position'
import { device } from './control/device'
import type { HID } from "node-hid";
import { env_data } from "./env" 

/** We use fastify to decrease any sort of delays caused by express. */
const app = Fastify();

/** The port. Default is 3000 */
const port = env_data.WEB_PORT;

/** Serve static files from svelte */
app.register(fastifyStatic, {
	root: path.join(__dirname, '..', '..', 'client', 'public')
})

// Add app.io
app.register(fastifySocketIo)

/**
 * Starts the web server.
 */
export const start = async(): Promise<void> => {

    app.ready(err => {
        // Rethrow the error if any
        if (err) {
			console.warn(err)
			return;
		}
    
        app.io.on("connect", (socket) => {

			logger.info(`Client connected to web interface. (ID: ${socket.id})`)

			socket.on("disconnect", (reason) => {
				logger.info(`Client ${socket.id} disconnected from web interface: ${reason}`)
			})

			socket.on("position", position)

            if (device() !== undefined)
                socket.emit("controllerAvailable")
        })
    })

	await app.listen(port);

	if (device() !== undefined) {
        (device() as HID).on("data", data => {
            const processedData = sendDataToSocket(app.io, data)

            if (processedData === undefined) return

            position(controllerDataToPosition(processedData))
        });

        (device() as HID).on("error", () => {
            logger.warn("Device disconnected");

            device(undefined);
        })
	}

	logger.info(`Listening to https://localhost:${port}`);
}