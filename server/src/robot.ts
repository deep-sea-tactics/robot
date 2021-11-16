import net from 'net'
import { logger } from './logger'
import flyd from 'flyd'
import { position } from './control/position';

const ip = "192.168.1.201";
const port = 9000

let hasConnected = false

const socket = net.createConnection(port, ip, () => {
    logger.info("Connected to robot!")
    hasConnected = true
})

flyd.on(change => {
    socket.write(JSON.stringify(change))
}, position)

socket.on("connect", () => {
    if (hasConnected)
        logger.info("Reconnected to robot.")
})

socket.on("error", e => logger.warn(e))

socket.on("close", () => {
    logger.warn("Disconnected; Attempting to reconnect")
    setTimeout(() => socket.connect(port, ip), 1000);
})