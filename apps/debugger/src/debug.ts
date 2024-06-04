import { program } from '@commander-js/extra-typings';

function getOrTry<T>(f: () => T): T | null {
	try {
		return f();
	} catch {
		return null;
	}
}

const sleep = (time: number): Promise<void> => new Promise(resolve => setInterval(() => resolve(), time));

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
	.usage('--pin <pin> (--digital/--servo/--analog) --value <value>')
	.requiredOption('-p, --pin <pin>', 'Pin number')
	.option('-d, --digital', 'Digital write')
	.option('-s, --servo', 'Servo write')
	.option('-a, --analog', 'PWM/analog write')
	.option('-r, --range <range>', 'PWM range')
	.option('-f, --frequency', 'PWM frequency')
	.option('-i, --info', 'Get info about a GPIO device.')
	.option('-l, --loop', 'Loop the write')
	.option('-v, --value <value>', 'Value to write')
	.showHelpAfterError(true)
	.action(async ({ pin, digital, servo, analog, info, range, value, frequency, loop }) => {
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

		if (!digital && !servo && !frequency && !analog) {
			program.error('Either --digital, --servo, or --analog (pwm) must be specified');
		}

		const write = () => {
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
		};

		if (loop) {
			setInterval(write, 20);
		} else {
			write();
		}
	});

program
	.command('multi')
	.argument('<pins...>')
	.action(async (pinWrites) => {
		const { Gpio } = await import('pigpio');
		for (const pinWrite of pinWrites) {
			const args = pinWrite.split('>');

			if (args.length !== 2) {
				program.error('No more than one ">" in the arg');
			}

			const value = parseInt(args[0]);

			const regex = /^(\d+)(\w)(?:\[(\w=\d+,?)+\])?$/;

			const latter = [...args[1].match(regex) ?? []];

			const [, pin, format, ...parameters] = latter;

			const gpio = new Gpio(parseInt(pin), { mode: Gpio.OUTPUT });

			const pairings: Record<string, (num: number) => unknown> = {
				d: gpio.digitalWrite,
				s: gpio.servoWrite,
				a: gpio.analogWrite,
				f: gpio.pwmFrequency
			};

			const parsedParameters = Object.fromEntries(parameters.map(parameter => trimComma(parameter).split("=")));

			const functor = pairings[format];

			const time = parsedParameters['t'];

			if (time) {
				const interval = setInterval(() => functor(value), 20);
				await sleep(time);
				clearInterval(interval);
			} else {
				functor(value);
			}
		}
	});

program.parse();
