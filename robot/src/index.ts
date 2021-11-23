import { io } from "socket.io-client"
import { logger } from './logger';

const socket = io("https://localhost:3000", { reconnection: true })

socket.on("connect", () => logger.info("Connected to server!"))

const server = net.createServer(client => {
    logger.info("Client connected")

    client.on("data", data => logger.info(data))
    client.on("close", () => logger.warn("Client disconnected."))
    client.on("error", e => logger.warn(e))
})

server.on("error", e => logger.warn(e))

server.listen(9000, () => logger.info("Listening to incoming connections."))