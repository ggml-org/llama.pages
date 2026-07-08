import { error, redirect } from '@sveltejs/kit';
import { defaultVersion } from '$lib/docs/content';

// The docs landing is the default version's index, served unversioned.
export const load = () => {
	if (!defaultVersion) {
		error(404, 'No docs versions available');
	}
	redirect(307, '/docs/index');
};
