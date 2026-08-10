import { redirect } from '@sveltejs/kit';
import { ROUTES } from '$lib/constants';

// The index lives at an explicit /docs/introduction URL so that relative links
// between markdown pages resolve correctly.
export const load = () => {
	redirect(307, ROUTES.DOCS_INDEX);
};
