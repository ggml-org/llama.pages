import type { Handle } from '@sveltejs/kit';

// Content negotiation for docs pages: clients preferring markdown are
// redirected to the raw .md mirror (see scripts/prepare-docs.js). Runs in
// dev/preview and on any server runtime — static prod hosting (GitHub
// Pages) has no runtime, so there the .md extension is the only way in.
export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;
	const accept = event.request.headers.get('accept') ?? '';

	if (
		pathname.startsWith('/docs') &&
		!pathname.endsWith('.md') &&
		accept.includes('text/markdown')
	) {
		const target = pathname === '/docs' ? '/docs/index.md' : `${pathname}.md`;
		return new Response(null, { status: 307, headers: { location: target } });
	}

	return resolve(event);
};
