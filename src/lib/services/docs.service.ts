import { MARKDOWN_EXT_RE, SOURCE_DIR_RE } from '$lib/constants';
import type { FlatTocEntry, TocItem } from '$lib/types';
import type { Component } from 'svelte';
import { parse } from 'yaml';

type MdModule = { default: Component };

// Docs source tree. The `import.meta.glob` patterns and the `?raw` suffix MUST
// stay string literals (vite parses them), so they're not reusable constants.

/** '/src/docs/foo/bar.md' → 'foo/bar' */
function normalizeKey(globPath: string): string {
	return globPath.replace(SOURCE_DIR_RE, '').replace(MARKDOWN_EXT_RE, '');
}

/**
 * Stateless loader for the static docs content: every page is bundled by vite
 * as a lazy component, and the `_toctree.yml` navigation tree is parsed into
 * the typed toctree. Consumed by the `/docs/[...page]` route for prerendering
 * and prev/next navigation.
 */
export class DocsService {
	private static readonly pageModules: Record<string, () => Promise<MdModule>> =
		import.meta.glob<MdModule>('/src/docs/**/*.md');

	private static readonly toctreeFile: Record<string, string> = import.meta.glob(
		'/src/docs/_toctree.yml',
		{
			eager: true,
			import: 'default',
			query: '?raw'
		}
	);

	private static readonly pages = Object.fromEntries(
		Object.entries(DocsService.pageModules).map(([globPath, loader]) => [
			normalizeKey(globPath),
			loader
		])
	);

	static readonly toctree: TocItem[] = parse(
		Object.values(DocsService.toctreeFile)[0]
	) as TocItem[];

	/** Depth-first list of linkable toctree entries — powers prev/next and titles. */
	static flattenToc(items: TocItem[]): FlatTocEntry[] {
		return items.flatMap((item) => [
			...(item.local ? [{ local: item.local, title: item.title }] : []),
			...(item.sections ? DocsService.flattenToc(item.sections) : [])
		]);
	}

	static getPageLoader(local: string): (() => Promise<MdModule>) | undefined {
		return DocsService.pages[local];
	}

	/** All prerender entries for /docs/[...page]. */
	static listAllEntries(): { page: string }[] {
		return DocsService.flattenToc(DocsService.toctree).map(({ local }) => ({ page: local }));
	}
}
