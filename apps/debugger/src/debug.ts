import { Gpio } from 'pigpio';
import { program } from 'commander';

program
	.option('-p, --pin <pin>', 'Pin number')
	.option('-d, --digital', 'Digital write')
	.option('-s, --servo', 'Servo write')
	.option('-p, --pwm', 'PWM/analog write')
	.option('-i, --info', 'Get info about a GPIO device.')
	.option('-v, --value <value>', 'Value to write');

program.parse(process.argv);

const { pin, digital, servo, value, pwm, info } = program.opts();

if (!pin) {
	console.error('Pin number is required');
	process.exit(1);
}

const gpio = new Gpio(parseInt(pin), { mode: Gpio.OUTPUT });

if (info) {
	console.log("PWM Duty Cycle", gpio.getPwmDutyCycle());
	console.log("PWM Frequency", gpio.getPwmFrequency());
	console.log("PWM Range", gpio.getPwmRange());
	console.log("PWM Real Range", gpio.getPwmRealRange());
	console.log("Servo Pulse Width", gpio.getServoPulseWidth());
	process.exit(0);
}

if (!value) {
	console.error('Value is required');
	process.exit(1);
}

if ([digital, servo, pwm].filter(Boolean).length > 1) {
	console.error('Only either --digital or --servo must be specified');
	process.exit(1);
}

if (digital) {
	gpio.digitalWrite(parseInt(value));
} else if (servo) {
	gpio.servoWrite(parseInt(value));
} else if (pwm) {
	gpio.pwmWrite(parseInt(value));
} else {
	console.error('Either --digital or --servo must be specified');
	process.exit(1);
}
