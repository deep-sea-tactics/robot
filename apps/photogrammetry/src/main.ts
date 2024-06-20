import { path } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { readdir, mkdir, copyFile, rm } from 'fs/promises';
import { consola } from 'consola';
import { installColmap } from './colmapInstall.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

await mkdir(join(currentDirectory, '..', 'videos'), { recursive: true });
await mkdir(join(currentDirectory, '..', 'output'), { recursive: true });
await mkdir(join(currentDirectory, '..', 'colmap'), { recursive: true });
await mkdir(join(currentDirectory, '..', 'project', 'images'), { recursive: true });

const videos = await readdir(join(currentDirectory, '..', 'videos'));

if (videos.length === 0) {
	consola.error('No videos found in the /videos directory!');
	process.exit(1);
}

const pictures = await readdir(join(currentDirectory, '..', 'output'));

if (pictures.length !== 0) {
	const reset = await consola.prompt(
		`There is already content in /output (${pictures.length} image${pictures.length === 1 ? '' : 's'}).
Do you want to reset the output?`,
		{
			type: 'confirm'
		}
	);

	if (!reset) {
		consola.error('There is already content in /output; skipping photogrammetry');
		console.error(1);
	}

	consola.start('Resetting /output and /project...');
	await rm(join(currentDirectory, '..', 'output'), { recursive: true, force: true });
	await rm(join(currentDirectory, '..', 'project'), { recursive: true, force: true });
	await mkdir(join(currentDirectory, '..', 'output'), { recursive: true });
	await mkdir(join(currentDirectory, '..', 'project', 'images'), { recursive: true });
	consola.success('Reset output and project folders!');
}

ffmpeg.setFfmpegPath(path);

consola.start('Extracting frames...');
await Promise.all(
	Array(videos.length)
		.fill(0)
		.map(
			(_, i) =>
				new Promise((resolve: (value: void) => unknown, reject) => {
					const video = videos[i];

					ffmpeg()
						.input(join(currentDirectory, '..', 'videos', video))
						.outputOptions('-vf', 'fps=5')
						.on('end', () => {
							consola.success('Frames extraction completed.');
							resolve();
						})
						.on('error', (err) => {
							consola.error('Error extracting frames: ', err);
							reject(err);
						})
						.save(join(currentDirectory, '..', 'output') + `/frame-v${i}-%03d.png`);
				})
		)
);

// copy the files over in output to project
const outputFiles = await readdir(join(currentDirectory, '..', 'output'));

for (const file of outputFiles) {
	const srcPath = join(currentDirectory, '..', 'output', file);
	const destPath = join(currentDirectory, '..', 'project', 'images', file);
	await copyFile(srcPath, destPath);
}

consola.success('All frames copied to project/images.');

await installColmap();
