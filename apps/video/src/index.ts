// Import child_process module
import { exec } from 'node:child_process';
const runCommand = 'ustreamer';

/** Checks if a command executes successfully */
function commandRunsSuccessfully(checkCommand: string): Promise<boolean> {
	const checkProcess = exec(checkCommand);

	return new Promise((resolve) => {
		checkProcess.on('close', (code) => {
			resolve(code === 0);
		});
	});
};

/** Gets the install command for the current operating system */
async function getInstallCommand() {
	if (await commandRunsSuccessfully('dnf --version')) {
		return 'sudo dnf install -y ustreamer';
	}

	if (await commandRunsSuccessfully('apt-get --version')) {
		return 'sudo apt-get install -y ustreamer';
	}

	throw new Error('Unsupported operating.');
}

/** Runs µStreamer; doesn't work if not installed. */
async function run() {
	const runProcess = exec(runCommand);

	// Handle run process events
	runProcess.stdout?.on('data', (data) => {
		console.log(data.toString());
	});

	runProcess.stderr?.on('data', (data) => {
		console.error(data.toString());
	});

	runProcess.on('close', (code) => {
		console.log(`uStreamer process exited with code ${code}`);
	});
}

/** Installs µStreamer. */
async function install() {
	console.log('uStreamer is not already installed. Attempting install...');

	// Check if operating system is supported
	const supportedOS = ['linux', 'darwin'];
	const os = process.platform;

	if (!supportedOS.includes(os)) {
		console.error(`Unsupported operating system: ${os}.`);
		console.error(`Perhaps you meant "pnpm run robot:mock" instead?`);
		return;
	}

	// Install uStreamer using apt-get
	const installCommand = await getInstallCommand();

	// Execute the command
	const installProcess = exec(installCommand);

	// Handle install process events
	installProcess.stdout?.on('data', (data) => {
		console.log(`[INSTALL] ${data}`);
	});

	installProcess.stderr?.on('data', (data) => {
		console.error(`[INSTALL ERROR] ${data}`);
	});

	installProcess.on('close', (code) => {
		if (code === 0) {
			run();
		} else {
			console.error('uStreamer installation failed.');
		}
	});
}

async function main() {
	// Check if uStreamer is already installed
	const isInstalled = await commandRunsSuccessfully(`${runCommand} --version`);

	if (isInstalled) {
		await run()
	} else {
		await install();
	}
};

// Call the function to install and run uStreamer
main();
