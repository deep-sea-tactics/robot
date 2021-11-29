import { io } from "socket.io-client"
import { startOrElse } from "./pwm"
import { logger } from './logger';

const address = "http://192.168.1.201:9000"

logger.info(`Client attempting to connect to ${address}...`)

const socket = io(address, { reconnection: true })

socket.on("connect", () => logger.info("Connected to server!"))
socket.on("disconnect", () => logger.info("Disconnected from server; Reconnecting..."))
socket.on("position", data => logger.info(data))

startOrElse()