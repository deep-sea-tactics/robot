import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

export default <UserConfig> {
	plugins: [sveltekit()],
	clearScreen: false,
	server: {
		strictPort: true,
		host: '0.0.0.0',
		hmr: !process.env.GITPOD_WORKSPACE_ID,
		port: 4000,
	},
	build: {
		target: 'es2022',
	},
};
