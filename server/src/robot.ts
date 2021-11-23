import { Server } from "socket.io";
import { logger } from './logger'
import flyd from 'flyd'
import { position } from './control/position';

const port = 9000

const io = new Server(port);

flyd.on(change => io.emit("position", JSON.stringify(change)), position)

io.on("connection", socket => {
    logger.info("Robot connected!")

	socket.on("close", () => logger.warn("Robot disconected."))
	socket.on("error", error => logger.warn("An exception with the robot has occured: " + error))
})