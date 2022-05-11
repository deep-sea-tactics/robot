import Fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifySocketIo from 'fastify-socket.io'
import path from "path"
import { sendDataToSocket } from './control/controller';
import { logger } from "./logger"
import { controllerData, controllerInUse } from './control/position'
import { device } from './control/device'
import type { HID } from "node-hid";
import { env_data } from "./env" 

/** We use fastify to decrease any sort of delays caused by express. */
const app = Fastify();

/* The port. Default is 3000 */
const port = env_data.WEB_PORT | 3000

/** Serve static files from svelte */
app.register(fastifyStatic, {
	root: path.join(__dirname, '..', '..', 'client', 'dist')
})

// Add app.io using socket.io intergration with fastify
app.register(fastifySocketIo)

/**
 * Starts the web server.
 */
export const start = async(): Promise<void> => {

	logger.debug("Attempting to start server.")

    app.ready(err => {
        // Rethrow the error if any
        if (err) {
			console.warn(err)
			return;
		}
    
        app.io.on("connect", (socket) => {

			// The client has connected
			logger.info(`Client connected to web interface. (ID: ${socket.id})`)

			// Warn the server if the client has disconnected
			socket.on("disconnect", (reason) => {
				logger.info(`Client ${socket.id} disconnected from web interface: ${reason}`)
			})

			socket.on("position", (position) => {
				// We use Object.assign to safely manipulate the position field.
				controllerData(
					Object.assign({}, controllerData(), { position })
				)
			})

			// Bind the emitted controllerInUse data to the server's controllerInuse field
			socket.on("controllerInUse", controllerInUse)

			// Tell the client if the device is available
            if (device() !== undefined)
                socket.emit("controllerAvailable")
        })
    })

	await app.listen(port);

	if (device() !== undefined) {
        (device() as HID).on("data", data => {

			if (!controllerInUse()) return

            const processedData = sendDataToSocket(app.io, data)

            if (processedData === undefined) return

            controllerData(processedData)
        });

        (device() as HID).on("error", () => {
            logger.warn("Device disconnected");

            device(undefined);
        })
	}

	logger.info(`Listening to https://localhost:${port} (prefer this over the one vite provides!)`);
}
