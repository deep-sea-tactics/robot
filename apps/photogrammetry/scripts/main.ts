import { path } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { readdir, mkdir } from 'fs/promises';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

ffmpeg.setFfmpegPath(path);

const videos = await readdir(join(currentDirectory, '..', 'videos'));

await mkdir(join(currentDirectory, '..', 'output'))

for (let i = 0; i < videos.length; i++) {
	const video = videos[i];

	const command = ffmpeg()
		.input(join(currentDirectory, '..', 'videos', video))
		.outputOptions('-vf', 'fps=5')
		.on('end', () => {
			console.log('Frames extraction completed.');
		})
		.on('error', (err) => {
			console.error('Error extracting frames: ', err);
		})
		.save(join(currentDirectory, '..', 'output') + `/frame-v${i}-%03d.png`);
}
