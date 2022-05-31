import { Server } from "socket.io"
import { sendDataToSocket, rawDataToControllerData } from './control/controller';
import { logger } from "./logger"
import { controllerData, controllerInUse } from './control/position'
import { device } from './control/device'
import type { HID } from "node-hid";
import { env_data } from "./env" 

/* The port. Default is 3000 */
const port = env_data.WEB_PORT | 3000

const io = new Server(3000, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
})

/**
 * Starts the socket server
 */
export const start = async(): Promise<void> => {

	logger.debug("Attempting to start socket server.")
    
	io.on("connection", (socket) => {

		// The client has connected
		logger.info(`Client connected to web interface. (ID: ${socket.id})`)

		// Warn the server if the client has disconnected
		socket.on("disconnect", (reason) => {
			logger.info(`Client ${socket.id} disconnected from web interface: ${reason}`)
		})

		socket.on("position", (position) => {
			// We use Object.assign to safely manipulate the position field.
			controllerData(
				{ ...controllerData(), position }
			)
		})

		// Bind the emitted controllerInUse data to the server's controllerInuse field
		socket.on("controllerInUse", controllerInUse)

		// Tell the client if the device is available
		if (device() !== undefined)
			socket.emit("controllerAvailable")
	})

	if (device() !== undefined) {
        (device() as HID).on("data", data => {

			if (!controllerInUse()) return

            const processedData = rawDataToControllerData(data)

            if (processedData === undefined) return

			if (Object.entries(processedData).toString() == Object.entries(controllerData()).toString()) return

			sendDataToSocket(io, processedData)

            controllerData(processedData)
        });

        (device() as HID).on("error", () => {
            logger.warn("Device disconnected");

            device(undefined);
        })
	}

	logger.info(`Socket listening to ${port}`);
}
