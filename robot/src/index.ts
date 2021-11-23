import { io } from "socket.io-client"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { PwmDriver, sleep } from 'adafruit-i2c-pwm-driver-async';
import { logger } from './logger';

const pwm = new PwmDriver({
    address: 0x40,
    device: '/dev/i2c-1',
    debug: true
});

const servoMin = 150; // Min pulse length out of 4096
const servoMax = 600; // Max pulse length out of 4096

const loop = () => sleep(1)
    .then(pwm.setPWM(0, 0, servoMin))
    .then(sleep(1))
    .then(pwm.setPWM(0, 0, servoMax))
    .then(loop);
  
// Initialize driver and loop
pwm.init()
    .then(() => pwm.setPWMFreq(50))
    .then(sleep(1))
    .then(loop)
    .catch(console.error);

const address = "http://192.168.1.201:9000"

const socket = io(address, { reconnection: true })

socket.on("connect", () => logger.info("Connected to server!"))
socket.on("disconnect", () => logger.info("Disconnected from server; Reconnecting..."))
socket.on("position", data => logger.info(data))