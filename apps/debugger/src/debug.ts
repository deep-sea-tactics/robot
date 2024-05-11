import { Gpio } from 'pigpio';
import { program } from 'commander';

program
	.option('-p', '--pin <pin>', 'Pin number')
	.option('-d', '--digital', 'Digital write')
	.option('-s', '--servo', 'Servo write')
	.option('-v', '--value <value>', 'Value to write');

program.parse(process.argv);

const { pin, digital, servo, value } = program.opts();

if (!pin) {
	console.error('Pin number is required');
	process.exit(1);
}

const gpio = new Gpio(parseInt(pin), { mode: Gpio.OUTPUT });

if (!value) {
	console.error('Value is required');
	process.exit(1);
}

if (digital && servo) {
	console.error('Only either --digital or --servo must be specified');
	process.exit(1);
}

if (digital) {
	gpio.digitalWrite(parseInt(value));
} else if (servo) {
	gpio.servoWrite(parseInt(value));
} else {
	console.error('Either --digital or --servo must be specified');
	process.exit(1);
}
