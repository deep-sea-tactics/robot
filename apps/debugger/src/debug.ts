import { program } from '@commander-js/extra-typings';

function getOrTry<T>(f: () => T): T | null {
	try {
		return f();
	} catch {
		return null;
	}
}

program
	.name('pigpio-cli')
	.description('PIGPIO CLI debugging tool.')
	.usage('pigpio-cli --pin <pin> (--digital/--servo/--analog) --value <value>')
	.requiredOption('-p, --pin <pin>', 'Pin number')
	.option('-d, --digital', 'Digital write')
	.option('-s, --servo', 'Servo write')
	.option('-a, --analog', 'PWM/analog write')
	.option('-r, --range <range>', 'PWM range')
	.option('-f, --frequency', 'PWM frequency')
	.option('-i, --info', 'Get info about a GPIO device.')
	.option('-v, --value <value>', 'Value to write')
	.showHelpAfterError(true)
	.action(async ({ pin, digital, servo, analog, info, range, value, frequency }) => {
		const { Gpio } = await import('pigpio');

		const gpio = new Gpio(parseInt(pin), { mode: Gpio.OUTPUT });

		if (info) {
			console.log("PWM Duty Cycle:", getOrTry(gpio.getPwmDutyCycle) ?? "Could not get.");
			console.log("PWM Frequency:", getOrTry(gpio.getPwmFrequency) ?? "Could not get.");
			console.log("PWM Range:", getOrTry(gpio.getPwmRange) ?? "Could not get.");
			console.log("PWM Real Range:", getOrTry(gpio.getPwmRealRange) ?? "Could not get.");
			console.log("Servo Pulse Width:", getOrTry(gpio.getServoPulseWidth) ?? "Could not get.");
			return;
		}

		if (!value) {
			program.error('error: required option, \'-v, --value <value>\' not specified');
		}

		if ([digital, servo, analog].filter(Boolean).length > 1) {
			program.error('Only either --digital, --servo, or --analog (pwm) must be specified');
		}

		if (digital) {
			gpio.digitalWrite(parseInt(value));
		} else if (servo) {
			gpio.servoWrite(parseInt(value));
		} else if (frequency) {
			gpio.pwmFrequency(parseInt(value));
		} else if (analog) {
			gpio.pwmWrite(parseInt(value));
			if (range)
				gpio.pwmRange(parseInt(range));
		} else {
			program.error('Either --digital, --servo, or --analog (pwm) must be specified');
		}
	})
	.parse();
