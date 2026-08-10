import type { FlatTocEntry, TocItem } from './types';
import type { Component } from 'svelte';
import { parse } from 'yaml';

type MdModule = { default: Component };

const pageModules: Record<string, () => Promise<MdModule>> = import.meta.glob<MdModule>(
	'/src/docs/**/*.md'
);
const toctreeFile: Record<string, string> = import.meta.glob('/src/docs/_toctree.yml', {
	eager: true,
	import: 'default',
	query: '?raw'
});

/** '/src/docs/foo/bar.md' → 'foo/bar' */
function normalizeKey(globPath: string): string {
	return globPath.replace(/^\/src\/docs\//, '').replace(/\.md$/, '');
}

const pages = Object.fromEntries(
	Object.entries(pageModules).map(([globPath, loader]) => [normalizeKey(globPath), loader])
);

export const toctree: TocItem[] = parse(Object.values(toctreeFile)[0]) as TocItem[];

/** Depth-first list of linkable toctree entries — powers prev/next and titles. */
export function flattenToc(items: TocItem[]): FlatTocEntry[] {
	return items.flatMap((item) => [
		...(item.local ? [{ local: item.local, title: item.title }] : []),
		...(item.sections ? flattenToc(item.sections) : [])
	]);
}

export function getPageLoader(local: string): (() => Promise<MdModule>) | undefined {
	return pages[local];
}

/** All prerender entries for /docs/[...page]. */
export function listAllEntries(): { page: string }[] {
	return flattenToc(toctree).map(({ local }) => ({ page: local }));
}
