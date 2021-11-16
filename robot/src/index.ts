import net from 'net'
import { logger } from './logger';

const server = net.createServer(client => {
    logger.info("Client connected")

    client.on("data", data => logger.info(data))
    client.on("close", () => logger.warn("Client disconnected."))
    client.on("error", e => logger.warn(e))
})

server.on("error", e => logger.warn(e))

server.listen(9000, () => logger.info("Listening to incoming connections."))