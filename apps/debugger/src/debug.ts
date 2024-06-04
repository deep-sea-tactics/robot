import { program } from '@commander-js/extra-typings';
import { getGpio } from './pigpiow.js';

const OUTPUT = 1;

function getOrTry<T>(f: () => T): T | null {
	try {
		return f();
	} catch {
		return null;
	}
}

const sleep = (time: number): Promise<void> => new Promise(resolve => setTimeout(resolve, time));

function trimComma(str: string): string {
	if (str.endsWith(",")) {
		return str.slice(0, -1);
	}

	return str;
}

program
	.name('pigpio-cli')
	.description('PIGPIO CLI debugging tool.');

program
	.command('simple')
	.usage('--pin <gpio number> (--digital/--servo/--analog) --value <value>')
	.requiredOption('-p, --pin <pin>', 'GPIO number')
	.option('-d, --digital', 'Digital write')
	.option('-s, --servo', 'Servo write')
	.option('-a, --analog', 'PWM/analog write')
	.option('-r, --range <range>', 'PWM range')
	.option('-f, --frequency', 'PWM frequency')
	.option('-i, --info', 'Get info about a GPIO device.')
	.option('-w, --wait <value>', 'Value to wait (in ms)')
	.option('-v, --value <value>', 'Value to write')
	.option('-m, --mock', "Doesn't actually use pigpio; simply mocks values and logs it.")
	.showHelpAfterError(true)
	.action(async ({ pin, digital, servo, analog, info, range, value, frequency, wait, mock }) => {
		const gpio = await getGpio(parseInt(pin), { mode: OUTPUT, mock });

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

		if (!digital && !servo && !frequency && !analog) {
			program.error('Either --digital, --servo, or --analog (pwm) must be specified');
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
		}

		if (wait)
			await sleep(parseInt(wait));
	});

program
	.command('multi')
	.usage(`value`)
	.argument('<pins...>')
	.option('-m, --mock', "Doesn't actually use pigpio; simply mocks values and logs it.")
	.action(async (pinWrites, { mock }) => {
		for (const pinWrite of pinWrites) {
			const regex = /^(\d+)t(\d+)([a-zA-Z])(?:\[(\w=\d+,?)+\])?$/;

			const latter = [...pinWrite.match(regex) ?? []];

			const [, unparsedValue, pin, format, ...parameters] = latter;

			const value = parseInt(unparsedValue);

			const gpio = await getGpio(parseInt(pin), { mode: OUTPUT, mock });

			const pairings: Record<string, (num: number) => unknown> = {
				d: gpio.digitalWrite,
				s: gpio.servoWrite,
				a: gpio.pwmWrite,
				f: gpio.pwmFrequency
			};

			const parsedParameters = Object.fromEntries(parameters.filter(Boolean).map(parameter => trimComma(parameter).split("=")));

			const functor = pairings[format];

			const time = parsedParameters['t'];

			functor(value);
			if (time)
				await sleep(time);
		}
	});

program.parse();
