import { error, redirect } from '@sveltejs/kit';
import { APP_VERSION } from '$lib/constants/site';
import { versions } from '$lib/docs/content';

// Default to the docs of the current app release, falling back to the first
// listed version.
export const load = () => {
	const version = versions.includes(`v${APP_VERSION}`) ? `v${APP_VERSION}` : versions[0];
	if (!version) {
		error(404, 'No docs versions available');
	}
	redirect(307, `/docs/${version}/index`);
};
