import Fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifySocketIo from 'fastify-socket.io'
import path from "path"
import { sendDataToSocket, controllerDataToPosition } from './control/controller';
import { logger } from "./logger"
import { position } from './control/position'
import * as HID from "node-hid";

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
 * 
 * @param device The device to send to the client.
 */
export const start = async (device: HID.HID | undefined): Promise<void> => {

    app.ready(err => {
        // Rethrow the error if any
        if (err) throw err
    
        app.io.on("connect", (socket) => {
            if (device !== undefined)
                socket.emit("controllerAvailable")
        })
    
        app.io.on("position", newPosition => position(newPosition))
    })

	await app.listen(port);

	if (device !== undefined) {
        device.on("data", data => {
            const processedData = sendDataToSocket(app.io, data)

            if (processedData === undefined) return

            position(controllerDataToPosition(processedData))
        });

        device.on("error", () => {
            logger.warn("Device disconnected");
        })
	}

	logger.info(`Listening to https://localhost:${port}`);
}