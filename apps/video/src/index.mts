import { platform } from 'os';
import { spawn } from 'child_process';
import { downloadMediaMTX } from './download.mts';
import { makeConfig } from './config.mts';

await downloadMediaMTX();

console.log("Attempting to run mediamtx...")

// run mediamtx
let childName: string;
switch (platform()) {
    case 'win32':
        childName = 'mediamtx.exe';
        break;
    case 'darwin':
    case 'linux':
        childName = 'mediamtx';
        break;
    default:
        throw new Error(`Unsupported OS: ${platform()}`);
}

await makeConfig();

const child = spawn(childName, ["../config/mediamtx.yml"], { cwd: 'resources' });

child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

child.on('error', (error) => {
    console.error(`error: ${error.message}`);
    process.exit(1);
});

child.on('close', (code) => process.exit(code ?? 0));
