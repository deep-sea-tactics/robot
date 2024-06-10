import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), Icons({ compiler: 'svelte' })],
  ssr: {
    noExternal: ['three']
  }
};

export default config;
