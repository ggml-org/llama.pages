import { error } from '@sveltejs/kit';
import { MODELS, getModel } from '$lib/models';
import type { PageLoad } from './$types';
import type { EntryGenerator } from './$types';

export const prerender = true;

const ORG_MIN_FOLLOWERS = 1000;
const USER_MIN_FOLLOWERS = 5000;

export const entries: EntryGenerator = () => {
	return MODELS.map((m) => ({ model: m.slug }));
};

export type Repo = {
	id: string;
	author: string;
	authorType: 'org' | 'user';
	avatarUrl: string;
	likes: number;
	quants: string[];
};

type HfModel = {
	id: string;
	author: string;
	likes: number;
	siblings: { rfilename: string }[];
};

type AuthorOverview = {
	avatarUrl: string;
	numFollowers: number;
};

type AuthorInfo = { type: 'org' | 'user'; avatarUrl: string };

function quantsFromSiblings(siblings: { rfilename: string }[]): string[] {
	// TODO (Julien): i'll get that info directly from the API in the future
	const seen = new Set<string>();
	const out: string[] = [];
	for (const { rfilename } of siblings) {
		if (!rfilename.toLowerCase().endsWith('.gguf')) continue;
		const base = rfilename
			.split('/')
			.pop()!
			.replace(/\.gguf$/i, '');
		const partMatch = base.match(/-(\d{5})-of-\d{5}$/);
		if (partMatch && partMatch[1] !== '00001') continue;
		const stripped = partMatch ? base.replace(/-\d{5}-of-\d{5}$/, '') : base;
		const m = stripped.match(/(?:^|-)((?:UD-|i1-)?(?:IQ\d|Q\d|BF\d+|F\d+|MXFP\d+|TQ\d)[\w-]*)$/i);
		const label = (m ? m[1] : stripped).toUpperCase();
		if (label.length >= 10) continue;
		if (!seen.has(label)) {
			seen.add(label);
			out.push(label);
		}
	}
	return out;
}

function absoluteAvatarUrl(url: string): string {
	return url.startsWith('/') ? `https://huggingface.co${url}` : url;
}

async function fetchAuthorInfo(name: string): Promise<AuthorInfo | null> {
	const orgRes = await fetch(
		`https://huggingface.co/api/organizations/${encodeURIComponent(name)}/overview`
	);
	if (orgRes.ok) {
		const data = (await orgRes.json()) as AuthorOverview;
		return data.numFollowers >= ORG_MIN_FOLLOWERS
			? { type: 'org', avatarUrl: absoluteAvatarUrl(data.avatarUrl) }
			: null;
	}
	const userRes = await fetch(
		`https://huggingface.co/api/users/${encodeURIComponent(name)}/overview`
	);
	if (userRes.ok) {
		const data = (await userRes.json()) as AuthorOverview;
		return data.numFollowers >= USER_MIN_FOLLOWERS
			? { type: 'user', avatarUrl: absoluteAvatarUrl(data.avatarUrl) }
			: null;
	}
	return null;
}

export const load: PageLoad = async ({ params, fetch }) => {
	const model = getModel(params.model);
	if (!model) {
		error(404, `Model "${params.model}" not found`);
	}
	const url =
		`https://huggingface.co/api/models?apps=llama.cpp` +
		`&filter=base_model:quantized:${encodeURIComponent(model.id)}` +
		`&limit=100&expand[]=author&expand[]=likes&expand[]=siblings`;
	let repos: Repo[] = [];
	try {
		const res = await fetch(url);
		if (res.ok) {
			const data = (await res.json()) as HfModel[];
			const authors = [...new Set(data.map((m) => m.author))];
			const authorInfos = new Map<string, AuthorInfo | null>();
			await Promise.all(
				authors.map(async (a) => {
					authorInfos.set(a, await fetchAuthorInfo(a));
				})
			);
			const seenAuthors = new Set<string>();
			repos = data.flatMap((m) => {
				const info = authorInfos.get(m.author);
				if (!info) return [];
				if (seenAuthors.has(m.author)) return [];
				seenAuthors.add(m.author);
				return [
					{
						id: m.id,
						author: m.author,
						authorType: info.type,
						avatarUrl: info.avatarUrl,
						likes: m.likes,
						quants: quantsFromSiblings(m.siblings)
					}
				];
			});
		}
	} catch {
		// keep empty on failure
	}
	return { model, repos };
};
