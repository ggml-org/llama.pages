import { error, redirect } from '@sveltejs/kit';
import {
	defaultVersion,
	flattenToc,
	getPageLoader,
	getToctree,
	listAllEntries
} from '$lib/docs/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => listAllEntries();

export const load: PageLoad = async ({ params }) => {
	let version = params.version;
	let local: string;
	// Unversioned URLs (/docs/{page}) serve the default version's content
	// in place — the first segment is a page local, not a version.
	let unversioned = false;

	if (getToctree(version)) {
		// Index pages live at an explicit /docs/{version}/index URL so that
		// relative links between markdown pages resolve within the version.
		if (!params.page) {
			redirect(307, `/docs/${version}/index`);
		}
		local = params.page;
	} else {
		if (!defaultVersion) {
			error(404, `Docs version "${version}" not found`);
		}
		unversioned = true;
		local = [params.version, params.page].filter(Boolean).join('/');
		version = defaultVersion;
	}

	const toctree = getToctree(version)!;
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
		unversioned,
		toctree,
		title: flat[index]?.title ?? local,
		prev: index > 0 ? flat[index - 1] : undefined,
		next: index !== -1 && index < flat.length - 1 ? flat[index + 1] : undefined
	};
};
