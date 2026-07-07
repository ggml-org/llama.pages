import { error, redirect } from '@sveltejs/kit';
import { flattenToc, getPageLoader, getToctree, listAllEntries } from '$lib/docs/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => listAllEntries();

export const load: PageLoad = async ({ params }) => {
	const { version } = params;

	const toctree = getToctree(version);
	if (!toctree) {
		error(404, `Docs version "${version}" not found`);
	}
	// Index pages live at an explicit /docs/{version}/index URL so that
	// relative links between markdown pages resolve within the version.
	if (!params.page) {
		redirect(307, `/docs/${version}/index`);
	}
	const local = params.page;
	const loader = getPageLoader(version, local);
	if (!loader) {
		error(404, `Docs page "${local}" not found in ${version}`);
	}

	const mod = await loader();
	const flat = flattenToc(toctree);
	const index = flat.findIndex((entry) => entry.local === local);

	return {
		component: mod.default,
		version,
		local,
		toctree,
		title: flat[index]?.title ?? local,
		prev: index > 0 ? flat[index - 1] : undefined,
		next: index !== -1 && index < flat.length - 1 ? flat[index + 1] : undefined
	};
};
