import type { EntryGenerator, PageLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { flattenToc, getPageLoader, listAllEntries, toctree } from '$lib/docs/content';

export const entries: EntryGenerator = () => listAllEntries();

export const load: PageLoad = async ({ params }) => {
	// The index lives at an explicit /docs/index URL so that relative links
	// between markdown pages resolve correctly.
	if (!params.page) {
		redirect(307, '/docs/index');
	}

	const local = params.page;
	const loader = getPageLoader(local);

	if (!loader) {
		error(404, `Docs page "${local}" not found`);
	}

	const mod = await loader();
	const flat = flattenToc(toctree);
	const index = flat.findIndex((entry) => entry.local === local);

	return {
		component: mod.default,
		local,
		next: index !== -1 && index < flat.length - 1 ? flat[index + 1] : undefined,
		prev: index > 0 ? flat[index - 1] : undefined,
		title: flat[index]?.title ?? local,
		toctree
	};
};
