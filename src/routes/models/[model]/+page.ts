import { error } from '@sveltejs/kit';
import { MODELS, getModel } from '$lib/models';
import type { PageLoad } from './$types';
import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return MODELS.map((m) => ({ model: m.slug }));
};

export const load: PageLoad = ({ params }) => {
	const model = getModel(params.model);
	if (!model) {
		error(404, `Model "${params.model}" not found`);
	}
	return { model };
};
