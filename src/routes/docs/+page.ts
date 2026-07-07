import { redirect } from '@sveltejs/kit';
import { APP_VERSION } from '$lib/constants/site';
import { versions } from '$lib/docs/content';

// Default to the docs of the current app release when that version has been
// tagged and extracted; fall back to main otherwise.
export const load = () => {
	const version = versions.includes(`v${APP_VERSION}`) ? `v${APP_VERSION}` : 'main';
	redirect(307, `/docs/${version}/index`);
};
