import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { MODELS, getModel } from '$lib/models';
import type { PageServerLoad, EntryGenerator } from './$types';

export const prerender = true;

const ORG_MIN_FOLLOWERS = 1000;
const USER_MIN_FOLLOWERS = 5000;

// Authenticate HF API calls during prerender so the build stays under the rate limit.
const HF_HEADERS: Record<string, string> = env.HF_TOKEN
	? { Authorization: `Bearer ${env.HF_TOKEN}` }
	: {};

// Fetch the HF API with auth, retrying on rate-limit / 5xx and throwing if it persists, so a
// throttled prerender FAILS the build (deploy is skipped, prod keeps the last good site) instead
// of silently baking empty results. Non-429 4xx (e.g. a real 404) are returned for the caller's
// .ok check, so legitimately-empty results still build fine.
async function hfFetch(url: string): Promise<Response> {
	const RETRIES = 3;
	for (let attempt = 0; ; attempt++) {
		const res = await fetch(url, { headers: HF_HEADERS });
		if (res.status !== 429 && res.status < 500) return res;
		if (attempt >= RETRIES) {
			throw new Error(`HF API ${res.status} after ${RETRIES} retries (rate limited?): ${url}`);
		}
		await new Promise((r) => setTimeout(r, 1000 * (attempt + 1))); // 1s, 2s, 3s backoff
	}
}

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
		const m = stripped.match(
			/(?:^|[-.])((?:UD-|i1-)?(?:IQ\d|Q\d|BF\d+|F\d+|MXFP\d+|TQ\d)[\w-]*)$/i
		);
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
	const orgRes = await hfFetch(
		`https://huggingface.co/api/organizations/${encodeURIComponent(name)}/overview`
	);
	if (orgRes.ok) {
		const data = (await orgRes.json()) as AuthorOverview;
		return data.numFollowers >= ORG_MIN_FOLLOWERS
			? { type: 'org', avatarUrl: absoluteAvatarUrl(data.avatarUrl) }
			: null;
	}
	const userRes = await hfFetch(
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

export const load: PageServerLoad = async ({ params }) => {
	const model = getModel(params.model);
	if (!model) {
		error(404, `Model "${params.model}" not found`);
	}
	const url =
		`https://huggingface.co/api/models?apps=llama.cpp` +
		`&filter=base_model:quantized:${encodeURIComponent(model.id)}` +
		`&limit=100&expand[]=author&expand[]=likes&expand[]=siblings`;
	let repos: Repo[] = [];
	const res = await hfFetch(url);
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
	return { model, repos };
};
