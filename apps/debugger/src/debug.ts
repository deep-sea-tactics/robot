import { Gpio } from 'pigpio';
import { program } from 'commander';

program
	.option('-p, --pin <pin>', 'Pin number')
	.option('-d, --digital', 'Digital write')
	.option('-s, --servo', 'Servo write')
	.option('-a, --analog', 'PWM/analog write')
	.option('-i, --info', 'Get info about a GPIO device.')
	.option('-v, --value <value>', 'Value to write');

program.parse(process.argv);

function getOrTry<T>(f: () => T): T | null {
	try {
		return f();
	} catch {
		return null;
	}
}

const { pin, digital, servo, value, analog, info } = program.opts();

if (!pin) {
	console.error('Pin number is required');
	process.exit(1);
}

const gpio = new Gpio(parseInt(pin), { mode: Gpio.OUTPUT });

if (info) {
	console.log("PWM Duty Cycle", getOrTry(gpio.getPwmDutyCycle) ?? "Could not get.");
	console.log("PWM Frequency", getOrTry(gpio.getPwmFrequency) ?? "Could not get.");
	console.log("PWM Range", getOrTry(gpio.getPwmRange) ?? "Could not get.");
	console.log("PWM Real Range", getOrTry(gpio.getPwmRealRange) ?? "Could not get.");
	console.log("Servo Pulse Width", getOrTry(gpio.getServoPulseWidth) ?? "Could not get.");
	process.exit(0);
}

if (!value) {
	console.error('Value is required');
	process.exit(1);
}

if ([digital, servo, analog].filter(Boolean).length > 1) {
	console.error('Only either --digital or --servo must be specified');
	process.exit(1);
}

if (digital) {
	gpio.digitalWrite(parseInt(value));
} else if (servo) {
	gpio.servoWrite(parseInt(value));
} else if (analog) {
	gpio.pwmWrite(parseInt(value));
} else {
	console.error('Either --digital or --servo must be specified');
	process.exit(1);
}
