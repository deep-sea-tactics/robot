import Fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifySocketIo from 'fastify-socket.io'
import path from "path"
import { sendDataToSocket, controllerDataToPosition } from './control/controller';
import { logger } from "./logger"
import { position } from './control/position'
import { device } from './control/device'
import type { HID } from "node-hid";

/** We use fastify to decrease any sort of delays caused by express. */
const app = Fastify();

/** The port. Default is 3000 */
const port = 3000;

/** Serve static files from svelte */
app.register(fastifyStatic, {
	root: path.join(__dirname, '..', '..', 'client', 'public')
})

// Add app.io
app.register(fastifySocketIo)

/**
 * Starts the web server with a controller device
 */
export const start = async(): Promise<void> => {

    app.ready(err => {
        // Rethrow the error if any
        if (err) throw err
    
        app.io.on("connect", (socket) => {
            if (device() !== undefined)
                socket.emit("controllerAvailable")
        })
    
        app.io.on("position", newPosition => position(newPosition))
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