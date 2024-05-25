import { exec } from 'node:child_process';
import isPi from 'detect-rpi';
import { execa } from 'execa';

/** Checks if a command executes successfully */
function commandRunsSuccessfully(checkCommand: string): Promise<boolean> {
	const checkProcess = exec(checkCommand);

	return new Promise((resolve) => {
		checkProcess.on('close', (code) => {
			resolve(code === 0);
		});
	});
}

/** Runs µStreamer; doesn't work if not installed. */
async function run() {
	if (isPi()) {
		await execa({
			stdio: ['ignore', 'inherit', 'inherit'],
			shell: '/usr/bin/bash'
		})`libcamerify ustreamer --host :: --encoder=m2m-image`;
	} else {
		await execa({ stdio: ['ignore', 'inherit', 'inherit'] })`ustreamer`;
	}
}

function orElse<T>(param: T, error: Error): NonNullable<T> {
	if (param === undefined || param === null) {
		throw error;
	}

	return param;
}

/** Installs µStreamer. */
async function install() {
	console.log('µStreamer is not already installed. Attempting install...');

	// Check if operating system is supported
	const supportedOS = ['linux', 'darwin'];
	const os = process.platform;

	if (!supportedOS.includes(os)) {
		console.error(`Unsupported operating system: ${os}.`);
		console.error(`Perhaps you meant "pnpm run robot:mock" instead?`);
		return;
	}

	const home = orElse(process.env.HOME, new Error("HOME environment variable doesn't exist."));

	console.log('Downloading µStreamer dependencies...');
	await execa`sudo apt-get update`;
	await execa`sudo apt-get install -y libevent-dev libjpeg62-turbo libbsd-dev libgpiod-dev libsystemd-dev libjpeg-dev git`;

	console.log(`Checking µStreamer folder (${home}/ustreamer)...`);
	try {
		await execa({ cwd: `${home}/ustreamer` })`git pull`;
		console.log(`µStreamer found locally - continuing build...`);
	} catch {
		console.log(`Cloning µStreamer...`);
		await execa({ cwd: home })`git clone --depth=1 https://github.com/pikvm/ustreamer`;
	}

	console.log('Building µStreamer...');
	await execa({ cwd: `${home}/ustreamer` })`make`;

	console.log('Adding µStreamer to PATH...');
	// we enable no throw here to make sure that we continue even if /usr/bin/ustreamer doesn't exist
	await execa`sudo rm -f /usr/bin/ustreamer`;
	await execa`sudo ln -s ${home}/ustreamer/ustreamer /usr/bin/ustreamer`;

	console.log('µStreamer installed!');
}

async function main() {
	// Check if uStreamer is already installed
	const isInstalled = await commandRunsSuccessfully(`ustreamer --version`);

	if (!isInstalled) {
		await install();
	}

	console.log('Running µStreamer...');
	await run();
}

// Call the function to install and run uStreamer
main();
