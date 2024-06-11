import memoize from "p-memoize";
import { emitter } from "./emitter.js";

const isMock = process.env.MOCK === 'true';

const pigpio = memoize(() => import('pigpio'));

interface Servo {
	write(pulseWidth: number): void
}

export async function servo(gpioPin: number): Promise<Servo> {
	if (isMock) {
		return {
			write(pulseWidth) {
				emitter.emit('servoMotorData', )
			}
		}
	} else {
		const { Gpio } = await pigpio();
		const gpio = new Gpio(gpioPin, { mode: Gpio.OUTPUT });

		return {
			write(pulseWidth) {
				gpio.servoWrite(pulseWidth);
			},
		}
	}
}
