import { Server } from "socket.io";
import { logger } from './logger'
import flyd from 'flyd'
import { controllerData } from './control/position';

const port = 9000 /* this line here was: const port = env_data.ROBOT_PORT */

/** Starts the robot server with socket.io. */
export async function start(): Promise<void> {
	const robot = new Server(port);

	// Emit any change that occurs to the position variable
	flyd.on(change => robot.emit("controllerData", JSON.stringify(change)), controllerData)

	robot.on("connection", (robotClient) => {
		logger.info(`Robot connected! ID: ${robotClient.id}`)

		robotClient.on("close", () => logger.warn("Robot disconected."))
		robotClient.on("error", error => logger.warn("An exception with the robot has occured: " + error))
	})

	// Handle any conenction errors
	robot.engine.on("connection_error", (err: { message: string }) => logger.warn(err.message))

	logger.info(`Robot ready to connected at port ${port}.`)
}
