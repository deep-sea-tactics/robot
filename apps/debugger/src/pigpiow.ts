import type { Gpio as GpioType } from 'pigpio';
import memoize from 'memoize';

interface CommonGpioOptions {
	mode: number,
	mock?: boolean
}

type ReplaceReturnType<T extends (...a: any[]) => unknown, TNewReturn> = (...a: Parameters<T>) => TNewReturn;

export interface CommonGpio {
	getPwmDutyCycle: GpioType["getPwmDutyCycle"];
	getPwmFrequency: GpioType["getPwmFrequency"];
	getPwmRange: GpioType["getPwmRange"];
	getPwmRealRange: GpioType["getPwmRealRange"];
	getServoPulseWidth: GpioType["getServoPulseWidth"];

	digitalWrite: ReplaceReturnType<GpioType["digitalWrite"], CommonGpio>;
	servoWrite: ReplaceReturnType<GpioType["servoWrite"], CommonGpio>;
	pwmFrequency: ReplaceReturnType<GpioType["pwmFrequency"], CommonGpio>;
	pwmWrite: ReplaceReturnType<GpioType["pwmWrite"], CommonGpio>;
	pwmRange: ReplaceReturnType<GpioType["pwmRange"], CommonGpio>;
}

const uncachedImportGpio = async () => await import('pigpio');
const importGpio = memoize(uncachedImportGpio);

export async function getGpio(pin: number, options: CommonGpioOptions): Promise<CommonGpio> {
	if (!options.mock) {
		const { Gpio } = await importGpio();

		const gpio = new Gpio(pin, options);

		return gpio;
	} else {
		const gpio: CommonGpio = {
			getPwmDutyCycle() {
				throw Error(`Can not find PWM duty cycle for pin ${pin}.`);
			},
			getPwmFrequency() {
				throw Error(`Can not find PWM duty frequency for pin ${pin}.`);
			},
			getPwmRange() {
				throw Error(`Can not find PWM duty range for pin ${pin}.`);
			},
			getPwmRealRange() {
				throw Error(`Can not find PWM duty real range for pin ${pin}.`);
			},
			getServoPulseWidth() {
				throw Error(`Can not find PWM servo pulse width for pin ${pin}.`);
			},

			digitalWrite(level) {
				console.log(`Called GPIO#digitalWrite to pin ${pin} with level ${level}.`);
				return gpio;
			},
			servoWrite(pulseWidth) {
				console.log(`Called GPIO#servoWrite to pin ${pin} with pulse width ${pulseWidth}.`);
				return gpio;
			},
			pwmFrequency(frequency) {
				console.log(`Called GPIO#pwmFrequency to pin ${pin} with frequency ${frequency}.`);
				return gpio;
			},
			pwmWrite(dutyCycle) {
				console.log(`Called GPIO#pwmWrite to pin ${pin} with frequency ${dutyCycle}.`);
				return gpio;
			},
			pwmRange(range) {
				console.log(`Called GPIO#pwmRange to pin ${pin} with range ${range}.`);
				return gpio;
			}
		}

		return gpio;
	}
}
