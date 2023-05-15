import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

export default <UserConfig> {
	plugins: [sveltekit()],
	// clearing the screen can mess with the stdout
	clearScreen: false,
	server: {
		// avoid wacky connection bugs and throw a runtime error early if the client is already running
		strictPort: true,
		// network support
		host: '0.0.0.0',
		// not gitpod AND not codespaces
		hmr: !process.env.GITPOD_WORKSPACE_ID && !process.env.CODESPACES,
		port: 4000,
		open: !process.env.GITPOD_WORKSPACE_ID && !process.env.CODESPACES,
	},
	preview: {
		strictPort: true,
		host: '0.0.0.0',
		port: 4000,
	},
	build: {
		// no need to build for older targets
		target: 'es2022',
	},
};
