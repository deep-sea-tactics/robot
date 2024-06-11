import { fromPwmData } from './data/pwm.js';
import { findClosest } from './util/findClosest.js';
import { assertRange } from './util/inRange.js';

const voltages = Object.freeze(Object.keys(fromPwmData));

/**
 * Get thruster data for a PWM & voltage value. If an exact data point doesn't exist, an approximation is made.
 *
 * @param rawVoltage the voltage to use, from 10V - 20V.
 * @param rawPWM the PWM to use, from 1100 - 1900, where ~1500 the middle.
 */
export function getData(rawVoltage: number, rawPWM: number): [current: number, force: number] {
	assertRange(rawVoltage, [10, 20], 'Voltage must be between the range 10V - 20V');

	// in pigpio, 0 ~= 1500
	if (rawPWM !== 0) assertRange(rawPWM, [1100, 1900], 'PWM must be between the range 1100 - 1900');

	const voltage = Math.round(rawVoltage);
	const pwm = rawPWM === 0 ? 1500 : Math.round(rawPWM);

	const [nearestVoltage] = findClosest(
		voltages,
		element =>
			parseInt(element) === voltage ? 0 : parseInt(element) > voltage ? 1 : -1,
		element => parseInt(element) - voltage
	);

	const [nearestPWM] = findClosest(
		Object.keys(fromPwmData[parseInt(nearestVoltage)]),
		element =>
			parseInt(element) === pwm ? 0 : parseInt(element) > pwm ? 1 : -1,
		element => parseInt(element) - pwm
	);

	return fromPwmData[parseInt(nearestVoltage)][parseInt(nearestPWM)];
}
