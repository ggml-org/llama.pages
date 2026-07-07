import { redirect } from '@sveltejs/kit';

// Later: redirect to the latest release instead of main.
export const load = () => {
	redirect(307, '/docs/main/index');
};
