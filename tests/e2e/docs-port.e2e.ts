import { expect, test } from '@playwright/test';

// The llama-server port is defined once (lib/constants/llama-server.js) and must
// reach BOTH docs build outputs with the real value:
//   - the raw /docs/*.md files served for the docs-copy feature, expanded by
//     scripts/prepare-docs.js
//   - the rendered /docs/* HTML pages, expanded by the mdsvex preprocess in
//     svelte.config.js
// A leftover {{DEFAULT_PORT}} token in either would leak the placeholder into a
// pasted article or a viewed page.

test('raw /docs/*.md route serves the real port, not the token', async ({ request }) => {
	const res = await request.get('/docs/serve.md');

	expect(res.ok()).toBeTruthy();

	const markdown = await res.text();

	// Expanded render of e.g. `curl http://localhost:8080/v1/chat/completions`.
	expect(markdown).toContain('http://localhost:8080');
	expect(markdown).not.toContain('{{DEFAULT_PORT}}');
});

test('rendered /docs/* page shows the real port, not the token', async ({ page }) => {
	await page.goto('/docs/serve');

	const body = page.locator('body');

	await expect(body).toContainText('localhost:8080');
	await expect(body).not.toContainText('{{DEFAULT_PORT}}');
});
