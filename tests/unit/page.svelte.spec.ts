import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import HomePage from '../../src/routes/+page.svelte';

const INSTALL_COMMAND = 'curl -fsSL https://llama.app/install.sh | bash';

describe('+page.svelte', () => {
	it('renders install command and package manager link', async () => {
		render(HomePage);

		await expect.element(page.getByText(INSTALL_COMMAND)).toBeInTheDocument();

		const packageManagersLink = page.getByRole('link', { name: 'Package managers' });
		await expect
			.element(packageManagersLink)
			.toHaveAttribute('href', 'https://github.com/ggml-org/llama.cpp/blob/master/docs/install.md');
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

		expect(writeText).toHaveBeenCalledWith(INSTALL_COMMAND);
		await expect.element(page.getByRole('button', { name: 'Copied command' })).toBeInTheDocument();
	});
});
