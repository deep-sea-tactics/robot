import net from 'net'
import { logger } from './logger'

// TODO ssh into robot?
const ip = "192.168.1.201";
const port = 9000

const socket = net.createConnection(port, ip, () => {
    logger.info("Connected!")
})