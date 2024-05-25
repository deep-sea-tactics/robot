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
		await execa`libcamerify ustreamer --host :: --encoder=m2m-image`;
	} else {
		await execa`ustreamer`;
	}
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

	console.log("Building µStreamer...");
	await execa`sudo apt-get install -y libevent-dev libjpeg62-turbo libbsd-dev libgpiod-dev libsystemd-dev libjpeg-dev`;
	await execa({ cwd: "~" })`git clone --depth=1 https://github.com/pikvm/ustreamer`
	await execa({ cwd: "~/ustreamer" })`make`;
	// we enable no throw here to make sure that we continue even if /usr/bin/ustreamer doesn't exist
	await execa`sudo rm -f /usr/bin/ustreamer`
	await execa`sudo ln -s ~/ustreamer/ustreamer ustreamer`
}

async function main() {
	// Check if uStreamer is already installed
	const isInstalled = await commandRunsSuccessfully(`ustreamer --version`);

	if (isInstalled) {
		await run();
	} else {
		await install();
	}
}

// Call the function to install and run uStreamer
main();
