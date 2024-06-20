import { path } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { readdir, mkdir, copyFile } from 'fs/promises';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

ffmpeg.setFfmpegPath(path);

const videos = await readdir(join(currentDirectory, '..', 'videos'));

await mkdir(join(currentDirectory, '..', 'output'), { recursive: true });
await mkdir(join(currentDirectory, '..', 'project', 'images'), { recursive: true });

await Promise.all(Array(videos.length).fill(0).map((_, i) => new Promise((resolve: (value: void) => unknown, reject) => {
	const video = videos[i];

	ffmpeg()
		.input(join(currentDirectory, '..', 'videos', video))
		.outputOptions('-vf', 'fps=5')
		.on('end', () => {
			console.log('Frames extraction completed.');
			resolve();
		})
		.on('error', (err) => {
			console.error('Error extracting frames: ', err);
			reject(err);
		})
		.save(join(currentDirectory, '..', 'output') + `/frame-v${i}-%03d.png`);
})));

// copy the files over in output to project
const outputFiles = await readdir(join(currentDirectory, '..', 'output'));

for (const file of outputFiles) {
	const srcPath = join(currentDirectory, '..', 'output', file);
	const destPath = join(currentDirectory, '..', 'project', 'images', file);
	await copyFile(srcPath, destPath);
}

console.log('All frames copied to project/images.');
