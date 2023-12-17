import { writeFile } from 'fs/promises';
import { stringify } from 'json-to-pretty-yaml';

const isMock = process.env.MOCK === 'true';

function iff(cond: boolean, obj: object) {
	return cond ? obj : {};
}

// TODO: auto-install FFMPEG
// all options are available at https://github.com/bluenviron/mediamtx/blob/dee7176cb02d36ae995da716f1ded5a171a5d7d2/mediamtx.yml
const config = {
	paths: {
		cam: {
			...iff(!isMock, {
				source: 'rpiCamera'
			}),
			...iff(isMock, {})
		}
	},
	webrtc: true
};

export async function makeConfig() {
	console.log('Making config...');
	await writeFile('config/mediamtx.yml', stringify(config));
}
