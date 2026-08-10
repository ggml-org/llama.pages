import { DEFAULT_PORT } from './src/lib/constants/llama-server.js';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { relative, sep } from 'node:path';
import rehypeSlug from 'rehype-slug';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// defaults to rune mode for the project, except for `node_modules`. Can be removed in svelte 6.
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
		}
	},
	extensions: ['.svelte', '.svx', '.md'],
	kit: {
		adapter: adapter(),
		output: {
			bundleStrategy: 'single'
		},
		prerender: {
			entries: ['*']
		}
	},
	preprocess: [
		// Expand {{DEFAULT_PORT}} in markdown docs from the shared constant, so
		// the port is defined once and docs can't drift from the app.
		{
			markup: ({ content }) => ({
				code: String(content).replaceAll('{{DEFAULT_PORT}}', String(DEFAULT_PORT))
			})
		},
		mdsvex({ extensions: ['.svx', '.md'], rehypePlugins: [rehypeSlug] })
	]
};

export default config;
