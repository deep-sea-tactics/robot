import Fastify from "fastify"
import fastifyStatic from "fastify-static"
import fastifySocketIo from 'fastify-socket.io'
import path from "path"
import { listenToLogitechController } from './controller';
import { logger } from "./logger"

const app = Fastify();
const port = 3000;

app.register(fastifyStatic, {
	root: path.join(__dirname, '..', '..', 'client', 'public')
})

// Add app.io
app.register(fastifySocketIo)

import * as HID from "node-hid";

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