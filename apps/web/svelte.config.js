import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: process.env.VITE_STATIC ? adapterStatic() : adapterNode(),
		env: {
			publicPrefix: 'VITE_'
		},
		paths: {
			base: process.env.VITE_STATIC ? '/robot' : '/'
		}
	}
};

export default config;
