// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { PwmDriver, sleep } from 'adafruit-i2c-pwm-driver-async';
import { logger } from "./logger"

export function startOrElse() {
	try {
		start()
	} catch (exception) {
		logger.warn("Error: ${exception}. Attempting again")
		start()
	}
}

async function start() {

	const pwm = new PwmDriver({
		address: 40,
		device: '/dev/i2c-1'
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
}