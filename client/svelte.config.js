import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
    vite: {
      clearScreen: false,
      server: {
        hmr: !process.env.HMR_HOST,
        port: 4000,
        host: "localhost",
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000"
        }
      }
    }
	}
};

export default config;
