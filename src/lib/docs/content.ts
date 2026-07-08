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

// Ordered version list (newest first) computed by scripts/extract-docs.js
// from git tags + the working tree.
const versionsFile: Record<string, string[]> = import.meta.glob('/.docs-build/_versions.json', {
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

export const versions: string[] = (Object.values(versionsFile)[0] ?? []).filter(
	(v) => v in toctrees
);

/** The version served at unversioned URLs (/docs/{page}): the newest one. */
export const defaultVersion: string | undefined = versions[0];

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
 * Route params for a docs link. On unversioned URLs (/docs/{page}, serving
 * the default version) links stay unversioned, so the page local itself
 * fills the [version]/[...page] segments.
 */
export function docLinkParams(
	version: string,
	local: string,
	unversioned: boolean
): { version: string; page: string } {
	if (!unversioned) return { version, page: local };
	const [first, ...rest] = local.split('/');
	return { version: first, page: rest.join('/') };
}

/**
 * All prerender entries for /docs/[version]/[...page]. Every page (including
 * 'index') gets an explicit URL; the bare `/docs/{version}` entry prerenders
 * as a redirect to its index, keeping relative markdown links working. The
 * default version's pages are additionally prerendered at unversioned URLs.
 */
export function listAllEntries(): { version: string; page: string }[] {
	return [
		...versions.flatMap((version) => [
			{ version, page: '' },
			...flattenToc(toctrees[version]).map(({ local }) => ({ version, page: local }))
		]),
		...(defaultVersion
			? flattenToc(toctrees[defaultVersion]).map(({ local }) =>
					docLinkParams(defaultVersion, local, true)
				)
			: [])
	];
}
