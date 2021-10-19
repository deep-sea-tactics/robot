import Fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifySocketIo from 'fastify-socket.io'
import path from "path"
import { listenToLogitechController } from './controller';
import { logger } from "./logger"
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
        if (err) throw err
    
        app.io.on("connect", (socket) => {
            if (device !== undefined)
                socket.emit("controllerAvailable")
        })
    
        app.io.on("position", position => {
            // TODO keep track of position
            // console.log(position)
        })
    })

	await app.listen(port);

	if (device !== undefined) {
		listenToLogitechController(app.io, device)
	}

	logger.info(`Listening to https://localhost:${port}`);
}