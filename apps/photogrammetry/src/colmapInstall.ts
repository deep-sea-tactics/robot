import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ReadableStream } from 'stream/web';
import { createWriteStream, existsSync } from 'node:fs';
import { finished } from 'node:stream/promises';
import { Readable, Transform } from 'node:stream';
import { consola } from 'consola';
import cliProgress from 'cli-progress';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

function getStreamHash(transform: Transform): Promise<void> {
	return new Promise((resolve, reject) => {
		transform.on('finish', function () {
			resolve();
		});
	});
}

export async function installColmap() {
	const currentDirectory = dirname(fileURLToPath(import.meta.url));
	const colmapOutput = join(currentDirectory, '..', 'colmap', 'colmap.zip');

	if (existsSync(colmapOutput)) {
		consola.info('COLMAP already installed.');
		return;
	}

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

	const hasher = createHash('md5');

	await getStreamHash(mainPipe.pipe(hasher));

	await finished(mainPipe.pipe(stream));
	progressBar.stop();

	consola.success('COLMAP downloaded! (colmap.zip)');
	writeFile(join(currentDirectory, '..', 'colmap', 'colmap.zip.hash'), hasher.read());
	consola.info('Generated colmap.zip.hash!');
}
