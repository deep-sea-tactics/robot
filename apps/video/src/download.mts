import { platform } from 'os';
import { mkdir, writeFile, readFile } from 'fs/promises';
import download from 'download';

function getLink(): string {
	let link: string;

	// get the link for the current OS and chip architecture
	switch (platform()) {
		case 'win32':
			link =
				'https://github.com/bluenviron/mediamtx/releases/download/v1.3.0/mediamtx_v1.3.0_windows_amd64.zip';
			break;
		case 'darwin':
			switch (process.arch) {
				case 'arm64':
					link =
						'https://github.com/bluenviron/mediamtx/releases/download/v1.3.0/mediamtx_v1.3.0_darwin_arm64.tar.gz';
					break;
				case 'x64':
					link =
						'https://github.com/bluenviron/mediamtx/releases/download/v1.3.0/mediamtx_v1.3.0_darwin_amd64.tar.gz';
					break;
				default:
					throw new Error(`Unsupported chip architecture: ${process.arch}`);
			}
			break;
		case 'linux':
			switch (process.arch) {
				case 'arm':
					link =
						'https://github.com/bluenviron/mediamtx/releases/download/v1.3.0/mediamtx_v1.3.0_linux_arm64v8.tar.gz';
					break;
				case 'arm64':
					link =
						'https://github.com/bluenviron/mediamtx/releases/download/v1.3.0/mediamtx_v1.3.0_linux_arm64v8.tar.gz';
					break;
				case 'x64':
					link =
						'https://github.com/bluenviron/mediamtx/releases/download/v1.3.0/mediamtx_v1.3.0_linux_amd64.tar.gz';
					break;
				default:
					throw new Error(`Unsupported chip architecture: ${process.arch}`);
			}
			break;
		default:
			throw new Error(`Unsupported OS: ${platform()}`);
	}

	return link;
}

export async function downloadMediaMTX() {
	const link = getLink();
	await mkdir('resources', { recursive: true });

	try {
		await readFile('resources/link.txt', 'utf-8');
		console.log('Already downloaded mediamtx. Skipping download.');
	} catch {
		console.log(`Downloading ${link}...`);
		await download(link, 'resources', { extract: true });
		console.log('Done! Writing link to resources/link.txt...');
		await writeFile('resources/link.txt', link);
	}
}
