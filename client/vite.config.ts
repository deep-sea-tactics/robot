import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { execSync } from 'child_process';

const url = process.env.GITPOD_WORKSPACE_ID
	? execSync('gp url 3000', { encoding: 'utf-8' }).trim()
	: 'http://localhost:3000';

export default <UserConfig>{
	plugins: [sveltekit()],
	clearScreen: false,
	server: {
		host: '0.0.0.0',
		fs: {
			strict: true
		},
		hmr: !process.env.HMR_HOST,
		port: 4000,
		headers: {
			'Access-Control-Allow-Origin': url
		}
	}
};
