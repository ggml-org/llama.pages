// Type declaration for mdsvex (v11 next - no bundled .d.ts)
declare module 'mdsvex' {
	import type { Plugin } from 'vite';

	export interface ParsePlugin {}

	export interface MdsvexOptions {
		extensions?: string[];
		parsePlugins?: ParsePlugin[];
	}

	export function mdsvex(options?: MdsvexOptions): Plugin[];
	export function compile(
		source: string,
		options?: { parsePlugins?: ParsePlugin[]; sourcemap?: boolean }
	): { code: string; mappings?: unknown[] };
}
