import { Server } from "socket.io";
import { logger } from './logger'
import flyd from 'flyd'
import { position } from './control/position';
import { env_data } from "./env" 
import { networkInterfaces } from 'os';

const port = 9000 /* this line here was: const port = env_data.ROBOT_PORT */

/** Starts the robot server with socket.io. */
export async function start(): Promise<void> {
	const io = new Server(port);

	// Emit any change that occurs to the position variable
	flyd.on(change => io.emit("position", JSON.stringify(change)), position)

	io.on("connection", (socket) => {
		logger.info("Robot connected!")

		socket.on("close", () => logger.warn("Robot disconected."))
		socket.on("error", error => logger.warn("An exception with the robot has occured: " + error))
	})

	// Handle any conenction errors
	io.engine.on("connection_error", (err: { message: string }) => logger.warn(err.message))

	logger.info(`Robot connection port + ":" + port}.`)
}
