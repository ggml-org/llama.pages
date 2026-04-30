import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import HomePage from '../../src/routes/+page.svelte';

describe('+page.svelte', () => {
	it('renders install command and GitHub download link', async () => {
		render(HomePage);

		await expect
			.element(page.getByRole('heading', { level: 1 }))
			.toHaveTextContent('Install llama.cpp on your system');
		await expect
			.element(page.getByText('curl -fsSL https://installama.sh | bash'))
			.toBeInTheDocument();

		const githubLink = page.getByRole('link', { name: 'download from GitHub' });
		await expect
			.element(githubLink)
			.toHaveAttribute('href', 'https://github.com/ggml-org/llama.cpp/releases');
	});

	it('copies install command and toggles icon after click', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);

		if (
			navigator.clipboard &&
			'writeText' in navigator.clipboard &&
			typeof navigator.clipboard.writeText === 'function'
		) {
			vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText);
		} else {
			Object.defineProperty(navigator, 'clipboard', {
				value: { writeText },
				configurable: true
			});
		}

		render(HomePage);

		const copyButton = page.getByRole('button', { name: 'Copy command' });
		await expect.element(copyButton).toBeInTheDocument();
		await copyButton.click();

		expect(writeText).toHaveBeenCalledWith('curl -fsSL https://installama.sh | bash');
		await expect.element(page.getByRole('button', { name: 'Copied command' })).toBeInTheDocument();
	});
});
