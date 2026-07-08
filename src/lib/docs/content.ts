import { parse } from 'yaml';
import type { Component } from 'svelte';
import type { FlatTocEntry, TocItem } from './types';

type MdModule = { default: Component };

// All versions are extracted into .docs-build/ by scripts/extract-docs.js
// before vite starts (from git tags, or the working tree for the not-yet-
// tagged current release).
const pageModules: Record<string, () => Promise<MdModule>> = import.meta.glob<MdModule>(
	'/.docs-build/*/**/*.md'
);

const toctreeFiles: Record<string, string> = import.meta.glob('/.docs-build/*/_toctree.yml', {
	query: '?raw',
	import: 'default',
	eager: true
});

const versionsFile: Record<string, string> = import.meta.glob('/src/docs/_versions.yml', {
	query: '?raw',
	import: 'default',
	eager: true
});

/** '/.docs-build/v1/foo/bar.md' → 'v1/foo/bar' */
function normalizeKey(globPath: string): string {
	return globPath.replace(/^\/\.docs-build\//, '').replace(/\.md$/, '');
}

const pages = Object.fromEntries(
	Object.entries(pageModules).map(([globPath, loader]) => [normalizeKey(globPath), loader])
);

const toctrees: Record<string, TocItem[]> = Object.fromEntries(
	Object.entries(toctreeFiles).map(([globPath, raw]) => [
		normalizeKey(globPath).replace(/\/_toctree\.yml$/, ''),
		parse(raw) as TocItem[]
	])
);

/** Versions listed in _versions.yml that actually have extracted content. */
export const versions: string[] = (parse(Object.values(versionsFile)[0]) as string[]).filter(
	(v) => v in toctrees
);

export function getToctree(version: string): TocItem[] | undefined {
	return toctrees[version];
}

/** Depth-first list of linkable toctree entries — powers prev/next and titles. */
export function flattenToc(items: TocItem[]): FlatTocEntry[] {
	return items.flatMap((item) => [
		...(item.local ? [{ title: item.title, local: item.local }] : []),
		...(item.sections ? flattenToc(item.sections) : [])
	]);
}

export function getPageLoader(
	version: string,
	local: string
): (() => Promise<MdModule>) | undefined {
	return pages[`${version}/${local}`];
}

export function hasPage(version: string, local: string): boolean {
	return `${version}/${local}` in pages;
}

/**
 * All prerender entries for /docs/[version]/[...page]. Every page (including
 * 'index') gets an explicit URL; the bare `/docs/{version}` entry prerenders
 * as a redirect to its index, keeping relative markdown links working.
 */
export function listAllEntries(): { version: string; page: string }[] {
	return versions.flatMap((version) => [
		{ version, page: '' },
		...flattenToc(toctrees[version]).map(({ local }) => ({ version, page: local }))
	]);
}
