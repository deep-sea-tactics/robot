import { fromPwmData } from "./data/pwm.js";
import { findClosest } from "./util/findClosest.js";
import { assertRange } from "./util/inRange.js";

const voltages = Object.freeze(Object.keys(fromPwmData).map(key => parseInt(key)));

/**
 * Get thruster data for a motor. If an exact data point doesn't exist, an approximation is made.
 *
 * @param rawVoltage the voltage to use, from 10V - 20V.
 * @param rawPWM the PWM to use, from 1100 - 1900, where ~1500 the middle.
 */
export function getData(rawVoltage: number, rawPWM: number): [current: number, force: number] {
	assertRange(rawVoltage, [10, 20], 'Voltage must be between the range 10V - 20V');
	assertRange(rawPWM, [1100, 1900], 'PWM must be between the range 1100 - 1900');

	const voltage = Math.round(rawVoltage);
	const pwm = Math.round(rawPWM);

	const [nearestVoltage] = findClosest(
		voltages,
		element => element === voltage ? 0 : (element > voltage ? 1 : -1)
	);

	const [nearestPWM] = findClosest(
		Object.keys(fromPwmData[nearestVoltage]).map(pwm => parseInt(pwm)),
		element => element === pwm ? 0 : (element > pwm ? 1 : -1)
	)

	return fromPwmData[nearestVoltage][nearestPWM];
}
