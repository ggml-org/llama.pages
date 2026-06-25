import { error } from '@sveltejs/kit';
import { familyGroupBySlug } from '$lib/catalog';
import type { PageLoad } from './$types';

// Resolve the slug to a family group, 404ing on an unknown slug. Runs at build
// time for each linked slug, since the whole site is prerendered.
export const load: PageLoad = ({ params }) => {
	const group = familyGroupBySlug(params.slug);
	if (!group) error(404, 'Family not found');
	return { group };
};
