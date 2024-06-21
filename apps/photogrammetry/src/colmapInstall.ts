import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ReadableStream } from 'stream/web';
import { createWriteStream } from 'node:fs';
import { pathExists } from 'fs-extra/esm';
import { finished } from 'node:stream/promises';
import { Readable, Transform } from 'node:stream';
import { consola } from 'consola';
import cliProgress from 'cli-progress';
import { createHash } from 'node:crypto';
import { writeFile, readdir, rm } from 'node:fs/promises';
import StreamZip from 'node-stream-zip';
import { ReadableStreamClone } from "readable-stream-clone";
import mvdir from 'mvdir';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const colmapOutput = join(currentDirectory, '..', 'colmap', 'colmap.zip');
const colmapOutDir = join(currentDirectory, '..', 'colmap', 'bin/');

function getStreamHash(transform: Transform): Promise<void> {
	return new Promise((resolve, reject) => {
		transform.on('finish', function () {
			resolve();
		});
	});
}

async function generateHash(mainPipe: Transform) {
	const hasher = createHash('md5');
	await getStreamHash(new ReadableStreamClone(mainPipe).pipe(hasher));
	writeFile(join(currentDirectory, '..', 'colmap', 'colmap.zip.hash'), hasher.read());
	consola.info('Generated colmap.zip.hash!');
}

async function unzipColmap(file: string) {
	consola.start('Unzipping COLMAP...');
	const zip = new StreamZip.async({ file });
	const count = await zip.extract(null, join(currentDirectory, '..', 'colmap', 'bin'));
	consola.success(`Extracted ${count} entries`);
	await zip.close();

	consola.start('Moving COLMAP out of nested directory...');
	const foundDirectories = await readdir(colmapOutDir);

	if (foundDirectories.length > 1) {
		consola.error('COLMAP unzipped not nested? This is unexpected - please correct if COLMAP has been updated.');
		process.exit(1);
	}

	const [rawFoundDirectory] = foundDirectories;
	const foundDirectory = join(colmapOutDir, rawFoundDirectory + '/');

	await (mvdir as unknown as typeof mvdir.default)(foundDirectory, join(foundDirectory, '..'));
	await rm(foundDirectory, { recursive: true, force: true });
	consola.success('Files moved!');
}

async function downloadColmap(): Promise<Transform> {
	consola.start('Downloading COLMAP...');

	const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
	let bytes = 0;

	const windowsInstallURL =
		'https://github.com/colmap/colmap/releases/download/3.9.1/COLMAP-3.9.1-windows-cuda.zip';

	const stream = createWriteStream(colmapOutput);
	const { body, headers } = await fetch(windowsInstallURL);
	if (!body) {
		consola.error(`No request body found for ${windowsInstallURL}.`);
		process.exit(1);
	}

	const length = Number(headers.get('content-length'));
	progressBar.start(length, 0);

	const mainPipe = Readable.fromWeb(body as ReadableStream<any>).pipe(
		new Transform({
			transform(chunk, encoding, callback) {
				bytes += chunk.length;
				progressBar.update(bytes);
				this.push(chunk);
				callback();
			}
		})
	);

	await finished(mainPipe.pipe(stream));
	progressBar.stop();

	consola.success('COLMAP downloaded! (colmap.zip)');
	return mainPipe;
}

export async function installColmap() {
	if (await pathExists(colmapOutput)) {
		consola.info('COLMAP already installed.');

		if ((await readdir(colmapOutDir)).length === 0) {
			await unzipColmap(colmapOutput);
		}
		return;
	}

	const mainStream = await downloadColmap();
	await generateHash(mainStream);
	await unzipColmap(colmapOutput);
}
