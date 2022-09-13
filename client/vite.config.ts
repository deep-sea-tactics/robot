import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

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
			'Access-Control-Allow-Origin': 'http://localhost:3000'
		}
	}
};
