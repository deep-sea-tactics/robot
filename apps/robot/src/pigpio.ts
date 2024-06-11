import memoize from 'p-memoize';
import { emitter } from './emitter.js';
import assert from 'node:assert';

const isMock = process.env.MOCK === 'true';

const pigpio = memoize(() => import('pigpio'));

export interface Servo {
	write(pulseWidth: number): void;
}

export type Range = [min: number, max: number];

/**
 * Processes pulseWidth to ensure that it is safe to write to the thruster.
 *
 * @param gpioPin The GPIO pin to log for error reporting.
 * @param pulseWidth The PWM value to confine.
 * @param range The range to confine the PWM value to
 * @returns A rounded, confined value with NaN protection.
 */
function processPulseWidth(gpioPin: number, pulseWidth: number, [min, max]: Range) {
	assert.ok(
		pulseWidth >= min,
		`[GPIO ${gpioPin}]: Value ${pulseWidth} is below minimum value ${min}.`
	);
	assert.ok(
		pulseWidth <= max,
		`[GPIO ${gpioPin}]: Value ${pulseWidth} is below maximum value ${max}.`
	);

	assert.ok(!Number.isNaN(pulseWidth), `[GPIO ${gpioPin}]: Value ${pulseWidth} is NaN.`);

	return Math.round(pulseWidth);
}

/**
 * Creates an arbitrary servo that works, mock mode or otherwise.
 *
 * @param gpioPin The GPIO pin to write to.
 * @param range The confined 'safe range' the pin can write to - helps prevent any incidental bad writes.
 */
export async function servo(gpioPin: number, range: Range): Promise<Servo> {
	if (isMock) {
		return {
			write(pulseWidth) {
				emitter.emit('gpioData', gpioPin, processPulseWidth(gpioPin, pulseWidth, range));
			}
		};
	} else {
		const { Gpio } = await pigpio();
		const gpio = new Gpio(gpioPin, { mode: Gpio.OUTPUT });

		return {
			write(pulseWidth) {
				gpio.servoWrite(processPulseWidth(gpioPin, pulseWidth, range));
			}
		};
	}
}
