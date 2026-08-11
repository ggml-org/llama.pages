import { redirect } from '@sveltejs/kit';

// The index lives at an explicit /docs/introduction URL so that relative links
// between markdown pages resolve correctly.
export const load = () => {
	redirect(307, '/docs/introduction');
};
