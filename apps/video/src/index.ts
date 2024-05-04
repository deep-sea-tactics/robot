// Import child_process module
import { exec } from 'node:child_process';
const runCommand = 'ustreamer';

// Function to check if uStreamer is installed
const isUstreamerInstalled = () => {
	const checkCommand = `${runCommand} --version`;
	const checkProcess = exec(checkCommand);

	return new Promise((resolve) => {
		checkProcess.on('close', (code) => {
			resolve(code === 0);
		});
	});
};

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

async function install() {
	console.log('uStreamer is not already installed. Attempting install...');

	// Check if operating system is supported
	const supportedOS = ['linux', 'darwin'];
	const os = process.platform;

	if (!supportedOS.includes(os)) {
		console.error(`Unsupported operating system: ${os}.`);
		console.error(`Perhaps you meant "pnpm run mock" instead?`);
		return;
	}

	// Install uStreamer using apt-get
	const installCommand = 'sudo apt-get install -y ustreamer';

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
	const isInstalled = await isUstreamerInstalled();

	if (isInstalled) {
		await run()
	} else {
		await install();
	}
};

// Call the function to install and run uStreamer
main();
