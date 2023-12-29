// Import child_process module
import { exec } from 'child_process';


// Function to check if uStreamer is installed
const isUstreamerInstalled = () => {
  const checkCommand = 'ustreamer --version';
  const checkProcess = exec(checkCommand);

  return new Promise((resolve) => {
    checkProcess.on('close', (code) => {
      resolve(code === 0);
    });
  });
};

// Function to install uStreamer and run it
const installAndRunUstreamer = async () => {
  // Check if uStreamer is already installed
  const isInstalled = await isUstreamerInstalled();

  if (isInstalled) {
    console.log('uStreamer is already installed. Skipping installation.');
    const runCommand = 'ustreamer';

    const runProcess = exec(runCommand);

    // Handle run process events
    runProcess.stdout?.on('data', (data) => {
      console.log(`[RUN] ${data}`);
    });

    runProcess.stderr?.on('data', (data) => {
      console.error(`[RUN ERROR] ${data}`);
    });

    runProcess.on('close', (code) => {
      console.log(`uStreamer process exited with code ${code}`);
    });
  } else {
	console.log("uStreamer is not already installed. Attempting install...");
    // Install uStreamer using apt-get
    const installCommand = "sudo apt-get install -y ustreamer";
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
        // If installation is successful, execute the run command
        const runCommand = 'ustreamer -b 8 -r 800x600 -f 10 -d /dev/video0';

        const runProcess = exec(runCommand);

        // Handle run process events
        runProcess.stdout?.on('data', (data) => {
          console.log(`[RUN] ${data}`);
        });

        runProcess.stderr?.on('data', (data) => {
          console.error(`[RUN ERROR] ${data}`);
        });

        runProcess.on('close', (code) => {
          console.log(`uStreamer process exited with code ${code}`);
        });
      } else {
        console.error('uStreamer installation failed.');
      }
    });
  }
};

// Call the function to install and run uStreamer
installAndRunUstreamer();
