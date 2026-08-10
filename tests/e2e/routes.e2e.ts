import { expect, test } from '@playwright/test';

// Smoke test that every prerendered page on the site actually renders (200,
// expected content present) rather than 404'ing or erroring out.

const PAGES: { path: string; marker: string }[] = [
	{ marker: 'https://llama.app/install.sh', path: '/' },
	{ marker: 'A curated selection of open models', path: '/models' },
	{ marker: 'GPT-OSS', path: '/models/gpt-oss' },
	{ marker: 'Introduction', path: '/docs/index' },
	{ marker: 'Running a server', path: '/docs/serve' },
	{ marker: 'API server', path: '/docs/api' }
];

for (const { marker, path } of PAGES) {
	test(`renders ${path}`, async ({ page }) => {
		const res = await page.goto(path);

		expect(res?.status()).toBe(200);
		await expect(page.locator('body')).toContainText(marker);
	});
}

test('GET /docs redirects to /docs/index', async ({ page }) => {
	await page.goto('/docs');
	await page.waitForURL('**/docs/index');

	await expect(page.locator('body')).toContainText('Introduction');
});

test('serves the canonical models catalog JSON', async ({ request }) => {
	const res = await request.get('/v1/models-catalog.json');

	expect(res.ok()).toBeTruthy();

	const data = await res.json();

	expect(Array.isArray(data)).toBeTruthy();
	expect(data.length).toBeGreaterThan(0);
	expect(data[0]).toHaveProperty('name');
	expect(data[0]).toHaveProperty('released');
});

test('/v1/catalog.json is a back-compat alias of /v1/models-catalog.json', async ({ request }) => {
	const canonical = JSON.stringify(await (await request.get('/v1/models-catalog.json')).json());
	const alias = await (await request.get('/v1/catalog.json')).json();

	expect(JSON.stringify(alias)).toBe(canonical);
});
