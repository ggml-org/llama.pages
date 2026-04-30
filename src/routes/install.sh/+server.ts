import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async ({ fetch }) => {
	const res = await fetch('https://installama.sh/', {
		headers: { 'user-agent': 'curl/8.0' }
	});
	if (!res.ok) {
		throw error(502, `Failed to fetch installama.sh: ${res.status}`);
	}
	const body = await res.text();
	return new Response(body, {
		headers: {
			'content-type': 'text/x-shellscript; charset=utf-8'
		}
	});
};
